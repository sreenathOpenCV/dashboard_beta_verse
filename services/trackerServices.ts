import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAccessToken } from '@/lib/auth';

const NEXTAUTH_URL = process.env.NEXTAUTH_URL;
const baseURL = `https://dvtools.bigvision.ai/dvtools_be/auth`;

const baseQuery = fetchBaseQuery({
  baseUrl:`https://dvtools.bigvision.ai/dvtools_be/utm_backend/`,
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

const formatDate = (dateString:any) => {
  const [yyyy, mm, dd] = dateString.split('-');
  return `${yyyy}-${mm}-${dd}`;
};

const convertObjectToQueryString = (obj:any) => {
  const query = new URLSearchParams();

  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      if (key === "dates") {
        obj[key].forEach((date:any) => query.append(key, formatDate(date)));
      } else {
        obj[key].forEach((value:any) => query.append(key, value));
      }
    } else {
      query.append(key, obj[key]);
    }
  }
  return query.toString().replace(/\+/g, "%20");
};

const trackerServices = createApi({
  reducerPath: 'lineChart',
  baseQuery,
  endpoints: (builder) => ({
    fetchData: builder.mutation({
      query: (userData) => {
        const queryString = convertObjectToQueryString(userData);
        return {
          url: `/get_counts?${queryString}`,
          method: 'GET',
        };
      },
    }),
    fetchDataKeys: builder.mutation({
      query: (params) => {
        const query = new URLSearchParams();
        params.forEach((param:any) => query.append('fetch', param));
        return {
          url: `/get_distincts?${query.toString()}`,
          method: 'GET',
        };
      },
    }),
  })
});

export const { useFetchDataMutation, useFetchDataKeysMutation } = trackerServices;
export default trackerServices;
