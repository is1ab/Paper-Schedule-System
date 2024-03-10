import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { UserService } from "./WebService/UserService"
import { RootState } from "../store"

export const userApiSlice = createSlice({
    name: 'userApi',
    initialState: {},
    reducers: {},
})

export const getSelfUserInfo = createAsyncThunk(
    "authApi/getSelfUserInfo",
    async (
        _,
        thunkApi
    ) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new UserService(token);
            const res = await service.getUserSelfInfo()
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`authApi/login: ${err}`)
            })
        }
    }
)

export const getUsers = createAsyncThunk(
    "authApi/getUsers",
    async (
        _,
        thunkApi
    ) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new UserService(token);
            const res = await service.getUsers()
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`authApi/getUsers: ${err}`)
            })
        }
    }
)

export default userApiSlice.reducer;