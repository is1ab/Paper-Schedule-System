import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../store"
import { SpecificScheduleDatePayloadType } from "../../type/schedule/ScheduleType"
import { ScheduleAdminService } from "./WebService/ScheduleAdminService"

export const scheduleAdminApiSlice = createSlice({
    name: 'scheduleAdminApiSlice',
    initialState: {},
    reducers: {},
})

export const specificScheduleDate = createAsyncThunk(
    'scheduleAdminApi/specificScheduleDate',
    async (payload: SpecificScheduleDatePayloadType, thunkApi) => {
        try {
            const state: RootState = thunkApi.getState() as RootState;
            const token = state.authApi.token;
            const service = new ScheduleAdminService(token);
            const res = await service.specific_schedule_date(payload)
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`scheduleAdminApi/specificScheduleDate: ${err}`)
            })
        }
    }
)