import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import  authApi  from "./services/apis/authApi";
import whitelistApi from "./services/apis/whitelistApi"
import authSlice from "./services/slices/authSlice";

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
        auth: persistedAuthReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    }).concat(authApi.middleware, whitelistApi.middleware)
})


export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>