import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { UserService } from "./WebService/UserService"
import { RootState } from "../store"
import { AddUserPayloadType, ModifyUserPayloadType } from "../../type/user/userPayloadType"

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

export const getUser = createAsyncThunk(
    "authApi/getUser",
    async (
        userId: string,
        thunkApi
    ) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new UserService(token);
            const res = await service.getUser(userId)
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`authApi/getUsers: ${err}`)
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

export const addUser = createAsyncThunk(
    "authApi/addUser",
    async (
        payload: AddUserPayloadType,
        thunkApi
    ) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new UserService(token);
            const res = await service.addUser(payload);
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`authApi/addUser: ${err}`)
            })
        }
    }
)

export const modifyUser = createAsyncThunk(
    "authApi/modifyUser",
    async (
        payload: ModifyUserPayloadType,
        thunkApi
    ) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new UserService(token);
            const res = await service.modifyUser(payload.id, payload);
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`authApi/modifyUser: ${err}`)
            })
        }
    }
)

export const blockedUser = createAsyncThunk(
    "authApi/blockedUser",
    async (
        user_id: string,
        thunkApi
    ) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new UserService(token);
            const res = await service.blockUser(user_id);
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`authApi/modifyUser: ${err}`)
            })
        }
    }
)


export default userApiSlice.reducer;