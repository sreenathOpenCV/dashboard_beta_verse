import { getSession } from 'next-auth/react';

export const getAccessToken = async () => {
  const session = await getSession();
  if (!session?.user?.accessToken) {
    throw new Error('No access token available');
  }
  console.log("getAccessToken", session.user.accessToken)
  return session.user.accessToken;
};
