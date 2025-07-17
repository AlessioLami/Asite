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
        })
    }),

})

export const { useGetUnitaQuery, useAddUnitaMutation, useRemoveUnitaMutation } = unitaApi
export default unitaApi

