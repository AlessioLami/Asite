import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const snifferApi = createApi({
    reducerPath: "snifferApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://asitesens-api.iotalab.app/logsniffer",
        credentials: "include",
    }),
    endpoints: (builder) => ({
        getSniffer: builder.query({
            query: ({dateStart, dateStop}) => `getlogsniffer?dateStart=${dateStart}&dateStop=${dateStop}`,
        })
    }),

})

export const { useGetSnifferQuery } = snifferApi
export default snifferApi