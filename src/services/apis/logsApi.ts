import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const logsApi = createApi({
    reducerPath: "logsApi",
    baseQuery: fetchBaseQuery({
        baseUrl: "/api/logdispo",
        credentials: "include",
    }),
    endpoints: (builder) => ({
        getLogs: builder.query({
            query: ({dateStart, dateStop}) => `get?dateStart=${dateStart}&dateStop=${dateStop}`,
        })
    }),

})

export const { useGetLogsQuery } = logsApi
export default logsApi