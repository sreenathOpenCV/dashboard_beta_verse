import type { NextAuthOptions, Session, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import NextAuth from "next-auth";

// Extend the User type
declare module "next-auth" {
  interface User {
    role: string;
    accessToken: string;
    refreshToken: string;
  }
  interface Session {
    user: {
      role: string;
      accessToken: string;
      refreshToken: string;
    };
  }
}

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: string;
  }
}

const refreshAccessToken = async (token: JWT) => {
  try {
    const res = await fetch('https://dvtools.bigvision.ai/dvtools_be/auth/refresh-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams({
        REFRESH_TOKEN: token.refreshToken
      }),
    });

    if (!res.ok) {
      throw new Error('Failed to refresh access token');
    }

    const response = await res.json();
    const refreshedTokens = response.data;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000, // Add expiration time
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    };
  }
};

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username:", type: "text", placeholder: "your-cool-username" },
        password: { label: "Password:", type: "password", placeholder: "your-awesome-password" }
      },
      async authorize(credentials) {
        if (!credentials) return null;

        try {
          const res = await fetch('https://dvtools.bigvision.ai/dvtools_be/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Accept': 'application/json'
            },
            body: new URLSearchParams({
              EMAIL: credentials.username,
              PASSWORD: credentials.password
            }),
          });

          if (!res.ok) {
            console.error('Failed to fetch:', res.statusText);
            throw new Error('Failed to fetch');
          }

          const response = await res.json();
          const user = response.data;

          if (response.status === 'success' && user && user.access_token) {
            return {
              id: user.id,
              name: user.name,
              role: user.role,
              accessToken: user.access_token,
              refreshToken: user.refresh_token,
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error in authorize function:", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Ref: https://authjs.dev/guides/basics/role-based-access-control#persisting-the-role
      if (user) {
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + 3600 * 1000; // Assume 1 hour expiration time
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
      }

      // Check if the access token has an error
      if (token.error) {
        // Sign out user and redirect to login page
        await fetch('/api/auth/signout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ callbackUrl: '/login' })
        });

        // Return a default session object instead of null
        return {
          ...session,
          user: {
            role: '',
            accessToken: '',
            refreshToken: ''
          }
        };
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login"
  }
};

export default NextAuth(options);
