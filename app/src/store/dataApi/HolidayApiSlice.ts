import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { HolidayAddPayload } from "../../type/holiday/HolidayPayload";
import { RootState } from "../store";
import { HolidayService } from "./WebService/HolidayService";

export const holidayApiSlice = createSlice({
    name: "holidayApiSlice",
    initialState: {},
    reducers: {}
})

export const addHoliday = createAsyncThunk(
    'holidayApi/addHoliday',
    async (payload: HolidayAddPayload, thunkApi) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new HolidayService(token);
            const res = await service.addHoliday(payload)
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`holidayApi/addHoliday: ${err}`)
            })
        }
    }
)

export const getHolidays = createAsyncThunk(
    'holidayApi/getHolidays',
    async (_, thunkApi) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new HolidayService(token);
            const res = await service.getHolidays()
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`holidayApi/getHoliday: ${err}`)
            })
        }
    }
)

export const deleteHoliday = createAsyncThunk(
    'holidayApi/deleteHoliday',
    async (date: string, thunkApi) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new HolidayService(token);
            const res = await service.deleteHoliday(date)
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`holidayApi/deleteHoliday: ${err}`)
            })
        }
    }
)