import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authApiReducer from './dataApi/AuthApiSlice';

export const store = configureStore({
    reducer: {
        authApi: authApiReducer,
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