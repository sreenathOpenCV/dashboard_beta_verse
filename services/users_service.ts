import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '@/lib/auth';

const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
const baseURL = `https://dvtools.bigvision.ai/dvtools_be/lead_assignment/`;

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

export const LeadApi = createApi({
  reducerPath: 'LeadApi',
  baseQuery: baseQuery,
  tagTypes: ['User', 'SheetsUser', 'SheetNames'],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (manage_path) => `${manage_path}`,
      providesTags: (result, error, manage_path) => [{ type: 'User', id: manage_path }],
    }),
    getSheetNames: builder.query({
      query: () => "/get_sheet_names",
      providesTags: ['SheetNames'],
    }),
    getSheetsUsers: builder.query({
      query: (manage_path) => `sheet_management?sheet_name=${manage_path}`,
      providesTags: (result, error, manage_path) => [{ type: 'User', id: manage_path }],
    }),
    postUser: builder.mutation({
      query: ({ path, userData }) => ({
        url: `${path}`,
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: (result, error, { path }) => [{ type: 'User', id: path }],
    }),
    postSheetsUser: builder.mutation({
      query: ({ path, userData }) => ({
        url: `sheet_management?sheet_name=${path}`,
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: (result, error, { path }) => [{ type: 'User', id: path }],
    }),
    refreshUsers: builder.mutation({
      query: () => ({
        url: "/refresh",
        method: 'PUT',
      }),
      // Invalidate relevant tags to trigger refetch
      invalidatesTags: ['User', 'SheetNames'],
    }),
  }),
});

export const { useGetUsersQuery, useGetSheetNamesQuery, useGetSheetsUsersQuery, usePostUserMutation, usePostSheetsUserMutation, useRefreshUsersMutation } = LeadApi;
