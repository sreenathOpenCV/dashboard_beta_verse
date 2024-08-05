import { getAccessToken } from '@/lib/auth';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
const baseURL = `${NEXTAUTH_URL}/dvtools_be/auth`;

const baseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  prepareHeaders: async (headers) => {
    try {
      const token = await getAccessToken();
      headers.set('Authorization', `Bearer ${token}`);
    } catch (error) {
      console.error('Error getting access token:', error);
    }
    return headers;
  },
});

export const accountApi = createApi({
  reducerPath: 'accountApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getAccountDetails: builder.query({
      query: () => '/profile',
    }),
    createAccount: builder.mutation({
      query: (newAccount) => ({
        url: '/register',
        method: 'POST',
        body: newAccount,
        headers: {
          'Content-Type': 'application/json'
        }
      }),
    }),
  }),
});

export const { useGetAccountDetailsQuery, useCreateAccountMutation } = accountApi;
