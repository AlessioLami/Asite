import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const unitaApi = createApi({
    reducerPath: "unitaApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/unitamisurata",
        credentials: "include",
    }),
    endpoints: (builder) => ({
        getUnita: builder.query({
            query: () => `get`,
        }),
        addUnita: builder.mutation({
            query: (codifica) => ({
                url: "add",
                method: "POST",
                body: codifica
            })
        }),
        removeUnita: builder.mutation({
            query: (id) => ({
                url: "delete",
                method: "DELETE",
                body: {idsToDelete: `${id}`}
            })
        }),
        updateUnita: builder.mutation({
            query: ({id, data}) => ({
                url: `update/${id}`,
                method: "PATCH",
                body: data
            })
        })
    }),

})

export const { useGetUnitaQuery, useAddUnitaMutation, useRemoveUnitaMutation, useUpdateUnitaMutation } = unitaApi
export default unitaApi

