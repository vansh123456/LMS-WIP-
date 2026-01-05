import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  baseQuery: fetchBaseQuery({ 
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
    prepareHeaders: (headers) => {
      console.log('API Base URL:', process.env.NEXT_PUBLIC_API_URL);
      console.log('Full URL will be:', process.env.NEXT_PUBLIC_API_URL + '/courses');
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Courses"],
  endpoints: (build) => ({
    getCourses: build.query<Course[], { category?: string }>({
      query: ({ category }) => {
        console.log('Making request to courses endpoint');
        return {
          url: "courses",
          params: { category },
        };
      },
      providesTags: ["Courses"],
      transformResponse: (response: any) => {
        console.log('Raw API Response:', response);
        // Extract the data array from the response object
        return response.data || [];
      },
    }),
    getCourse: build.query<Course, string>({
      query: (id) => `courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),
  }),
});

export const { useGetCourseQuery, useGetCoursesQuery } = api;