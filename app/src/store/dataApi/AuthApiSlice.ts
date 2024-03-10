import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { AuthService } from "./WebService/AuthService"
import { LoginRequestPayload, LoginResponse } from "../../type/auth/loginPayload"

interface AuthApiState {
    token: string
}

const initialDataState: AuthApiState = {
    token: ""
}

export const authApiSlice = createSlice({
    name: 'authApi',
    initialState: initialDataState,
    reducers: {
        setToken: (state: AuthApiState, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
    },
})

export const login = createAsyncThunk(
    "authApi/login",
    async (
        payload: LoginRequestPayload, 
        thunkApi
    ) => {
        try {
            const service = new AuthService(null);
            const res = await service.login(payload.account, payload.password);
            const data = res.data as LoginResponse;
            setToken(data.token)
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`authApi/login: ${err}`)
            })
        }
    }
)

export const { setToken } = authApiSlice.actions;
export const getTokenState  = (state: AuthApiState) => state.token;
export default authApiSlice.reducer;