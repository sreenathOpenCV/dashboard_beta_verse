"use client";

import { LeadApi } from '../services/users_service';
import { configureStore } from '@reduxjs/toolkit';
import sheetSelectionReducer from './sheetSelectionSlice';
import authReducer from './authSlice';
import bootCampProgramReducer from './Slices/bootcampProgramSeries';
import bootcampSourceReducer from './Slices/bootcampSelectivesSlice';
import trackerServices from '../services/trackerServices';
import { accountApi } from '../services/accountServices';
import { WebinarApi } from '../services/webinarServices';
import unsavedPopupReducer from "./Slices/unsavedPopupSlice";
import { salesApi } from '@/services/callAuditServices';

export const store = configureStore({
    reducer: {
      [LeadApi.reducerPath]: LeadApi.reducer,
      [accountApi.reducerPath]: accountApi.reducer,
      [WebinarApi.reducerPath]: WebinarApi.reducer,
      [salesApi.reducerPath]: salesApi.reducer,
      [trackerServices.reducerPath]: trackerServices.reducer,
      sheetSelection: sheetSelectionReducer,
      bootcampProgram: bootCampProgramReducer,
      bootcampSource: bootcampSourceReducer,
      unsavedPopup: unsavedPopupReducer,
      auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>getDefaultMiddleware().concat(LeadApi.middleware, trackerServices.middleware, accountApi.middleware, WebinarApi.middleware, salesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;