import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authApiReducer from './dataApi/AuthApiSlice';
import userApiReducer from './dataApi/UserApiSlice';
import settingApiReducer from './dataApi/SettingApiSlice';

export const store = configureStore({
    reducer: {
        authApi: authApiReducer,
        userApi: userApiReducer,
        settingApi: settingApiReducer
    },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;