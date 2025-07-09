import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const whitelistApi = createApi({
    reducerPath: "whitelistApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/usersteam",
        credentials: "include",
    }),
    endpoints: (builder) => ({
        getWhitelistedUsers: builder.query({
            query: () => "get",
        }),
        addWhitelistedUser: builder.mutation({
                query: (userData) => ({
                    url: "/add",
                    method: "POST",
                    body: userData,
                }) 
        }),
        removeWhitelistedUser: builder.mutation({
            query: (id) => ({
                url: `/delete/${id}`,
                method: "DELETE",
            })
        })
    })

})

export const { useGetWhitelistedUsersQuery, useAddWhitelistedUserMutation, useRemoveWhitelistedUserMutation } = whitelistApi
export default whitelistApi