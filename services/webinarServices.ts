import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '@/lib/auth';

const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
const baseURL = `${NEXTAUTH_URL}/dvtools_be`;

const baseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  prepareHeaders: async (headers, { getState }) => {
    try {
      const token = await getAccessToken();
      headers.set('Authorization', `Bearer ${token}`);
    } catch (error) {
      console.error('Error getting access token:', error);
    }
    return headers;
  },
});

export const WebinarApi = createApi({
  reducerPath: 'WebinarApi',
  baseQuery: baseQuery,
  tagTypes: ['User', 'SheetsUser'],
  endpoints: (builder) => ({
    postAttendees: builder.mutation({
      query: ({ file, queryParams }) => {
        const queryString = new URLSearchParams(queryParams).toString();
        
        const formData = new FormData();
        formData.append('file', file);
        
        return {
          url: `/webinar_live_attended/upload_report?${queryString}`,
          method: 'POST',
          body: formData,
        };
      },
    }),
  }),
});

export const { usePostAttendeesMutation } = WebinarApi;
