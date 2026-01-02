import { configureStore } from "@reduxjs/toolkit"
import swimReducer from "./features/swimSlices"
import { TypedUseSelectorHook, useSelector } from "react-redux";

export const store = configureStore({
    reducer: {
        swimReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;