import { configureStore } from '@reduxjs/toolkit';
import { remoterViewSlice } from './slices/remoter-view.slice.ts';

export const store = configureStore({
    reducer: {
        remoter: remoterViewSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
