import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    user: any | null;
    role: any | null;
}

const initialState: AuthState = {
    user: null,
    role: null,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{user: any; role: any}>
        ) => {
            state.user = action.payload.user;
            state.role = action.payload.role;
        },
        logout: (state) => {
            state.user = null;
            state.role = null;
        }
    }
})

export const {setCredentials, logout } = authSlice.actions;
export default authSlice.reducer