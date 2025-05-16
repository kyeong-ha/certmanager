// src/store.ts
import { configureStore } from '@reduxjs/toolkit';
import educationCenterReducer from '@/features/center/slices/educationCenterSlice';

export const store = configureStore({
  reducer: {
    educationCenter: educationCenterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;