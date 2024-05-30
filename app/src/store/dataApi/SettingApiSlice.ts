import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { SettingService } from "./WebService/SettingService";

interface SystemArgsApiState {
    labZhName: string
    labEnName: string
    orgZhName: string
    orgEnName: string
}

const initialDataState: SystemArgsApiState = {
    labZhName: "",
    labEnName: "",
    orgZhName: "",
    orgEnName: "",
}

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

export const getSystemArguments = createAsyncThunk(
    "authApi/getSystemArguments",
    async (
        _, 
        thunkApi
    ) => {
        try {
            const service = new SettingService(null);
            const res = await service.getSystemArgs()
            const data = res.data;
            return data;
        } catch (err: any){
            return thunkApi.rejectWithValue(() => {
                console.log(`authApi/getSystemArguments: ${err}`)
            })
        }
    }
)

export const settingApiSlice = createSlice({
    name: 'settingApi',
    initialState: initialDataState,
    selectors: {
        getOrganizationZhName: (state) => state.orgZhName,
        getOrganizationEnName: (state) => state.orgEnName,
        getLabZhName: (state) => state.labZhName,
        getLabEnName: (state) => state.labEnName,
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getSystemArguments.fulfilled, (state, action) => {
            const data = action.payload["data"] as {key: string, value: string}[]
            state.labZhName = data.find((data) => data.key === "LAB_ZH")?.value ?? "";
            state.labEnName = data.find((data) => data.key === "LAB_EN")?.value ?? "";
            state.orgZhName = data.find((data) => data.key === "ORG_ZH")?.value ?? "";
            state.orgEnName = data.find((data) => data.key === "ORG_EN")?.value ?? "";
        })
    }
})

export const { getOrganizationZhName, getOrganizationEnName, getLabZhName, getLabEnName } = settingApiSlice.selectors;
export default settingApiSlice.reducer;