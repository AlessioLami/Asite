import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const macchinaApi = createApi({
    reducerPath: "macchinaApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://asitesens-api.iotalab.app/macchina",
        credentials: "include",
    }),
    endpoints: (builder) => ({
        getMacchine: builder.query({
            query: () => "/get",
        }),
    }),
})

export const { useGetMacchineQuery } = macchinaApi
export default macchinaApi
