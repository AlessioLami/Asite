import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const dispoApi = createApi({
    reducerPath: "dispoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/dispo",
        credentials: "include",
    }),
    endpoints: (builder) => ({
        getDispo: builder.query({
            query: () => "get",
        }),
        addDispo: builder.mutation({
            query: (dispoData) => ({
                url: "add",
                method: "POST",
                body: dispoData
            })
        }),
        removeDispo: builder.mutation({
            query: (id) => ({
                url: `delete`,
                method: "DELETE",
                body: {"idsToDelete": [`${id}`]}
            })
        }),
        updateDispo: builder.mutation({
            query: ({id, data}) => ({
                url: `update/${id}`,
                method: "PATCH",
                body: data
            })
        })
    }),
})

export default dispoApi
export const { useGetDispoQuery, useAddDispoMutation, useRemoveDispoMutation, useUpdateDispoMutation } = dispoApi

