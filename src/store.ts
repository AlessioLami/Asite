import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import  authApi  from "./services/apis/authApi";
import whitelistApi from "./services/apis/whitelistApi"
import authSlice from "./services/slices/authSlice";
import logsApi from "./services/apis/logsApi";
import dispoApi from "./services/apis/dispoApi";
import unitaApi from "./services/apis/unitaApi";
import snifferApi from "./services/apis/snifferApi";

const persistConfig = {
    key: "auth",
    storage, 
    whitelist: ["user", "role"]
}

const persistedAuthReducer = persistReducer(persistConfig, authSlice)

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        [whitelistApi.reducerPath]: whitelistApi.reducer,
        [logsApi.reducerPath]: logsApi.reducer,
        [dispoApi.reducerPath]: dispoApi.reducer,
        [unitaApi.reducerPath]: unitaApi.reducer,
        [snifferApi.reducerPath]: snifferApi.reducer,
        auth: persistedAuthReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(authApi.middleware, whitelistApi.middleware, logsApi.middleware, dispoApi.middleware, unitaApi.middleware, snifferApi.middleware)
})


export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>