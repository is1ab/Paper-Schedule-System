import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { ScheduleService } from "./WebService/ScheduleService"
import { RootState } from "../store"
import { AddSchedulePayloadType } from "../../type/schedule/ScheduleType"

export const scheduleApiSlice = createSlice({
    name: 'scheduleApiSlice',
    initialState: {},
    reducers: {},
})

export const addSchedule = createAsyncThunk(
    'scheduleApi/addSchedule',
    async (payload: AddSchedulePayloadType, thunkApi) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new ScheduleService(token);
            const res = await service.add_schedule(payload)
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`scheduleApi/addSchedule: ${err}`)
            })
        }
    }
)

export const getSchedule = createAsyncThunk(
    'scheduleApi/getSchedule',
    async(scheduleId: string, thunkApi) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new ScheduleService(token);
            const res = await service.getSchedule(scheduleId)
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`scheduleApi/getSchedule: ${err}`)
            })
        }
    }
)

export const getAllSchedule = createAsyncThunk(
    'scheduleApi/getAllSchedule',
    async (_, thunkApi) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new ScheduleService(token);
            const res = await service.get_all_schedule()
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`scheduleApi/addSchedule: ${err}`)
            })
        }
    }
)

export const checkDuplicateUrl = createAsyncThunk(
    'scheduleApi/checkDuplicateUrl',
    async (url: string, thunkApi) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new ScheduleService(token);
            const res = await service.check_duplicate_url(url)
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`scheduleApi/checkDuplicateUrl: ${err}`)
            })
        }
    }
)

export const uploadAttachment = createAsyncThunk(
    'scheduleApi/uploadAttachment',
    async (formData: FormData, thunkApi) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new ScheduleService(token);
            const res = await service.upload_attachment(formData)
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`scheduleApi/uploadAttachment: ${err}`)
            })
        }
    }
)

export default scheduleApiSlice.reducer;