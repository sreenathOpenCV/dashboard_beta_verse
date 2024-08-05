import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '@/lib/auth';

const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
const baseURL = `https://dvtools.bigvision.ai/dvtools_be/dv_sales_calls/get_all_sales_records`;

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

export const salesApi = createApi({
  reducerPath: 'salesApi',
  baseQuery: baseQuery,
  tagTypes: ['User', 'SheetsUser', 'SheetNames'],
  endpoints: (builder) => ({
    getsalesrecords: builder.query({
      query: (manage_path) => `${manage_path}`,
      providesTags: (result, error, manage_path) => [{ type: 'User', id: manage_path }],
    })
  })
});

export const { useGetsalesrecordsQuery} = salesApi;
