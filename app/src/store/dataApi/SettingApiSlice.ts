import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { SettingService } from "./WebService/SettingService";

export const getRoles = createAsyncThunk(
    "authApi/getRoles",
    async (
        _, 
        thunkApi
    ) => {
        try {
            const service = new SettingService(null);
            const res = await service.getRoles()
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`authApi/getRoles: ${err}`)
            })
        }
    }
)

export const getAnnouncments = createAsyncThunk(
    "authApi/getAnnouncments",
    async (
        _, 
        thunkApi
    ) => {
        try {
            const service = new SettingService(null);
            const res = await service.getAnnouncments()
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`authApi/getAnnouncments: ${err}`)
            })
        }
    }
)

export const settingApiSlice = createSlice({
    name: 'settingApi',
    initialState: {},
    reducers: {},
})

export default settingApiSlice.reducer;