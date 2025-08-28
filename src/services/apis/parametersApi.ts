import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const parametersApi = createApi({
    reducerPath: "parametersApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/appsettings",
        credentials: "include",
    }),
    endpoints: (builder) => ({
        update: builder.mutation({
            query: (data) => ({
                url: "/update",
                method: "POST",
                body: data,
            }),
        
        }),
        getParameters: builder.query({
            query: () => "/get",
        }),
    }),
})

export const { useUpdateMutation, useGetParametersQuery } = parametersApi;
export default parametersApi;