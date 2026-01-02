import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { timeForm } from "@/interfaces"

type InitialState = {
    value: Times;
}

type Times = {
    times: Array<timeForm>
}

const initialState = {
    value: {
        times: []
    } as Times
} as InitialState


export const swim = createSlice({
    name: "swim",
    initialState,
    reducers: {
        setTimes: (state, action: PayloadAction<Array<timeForm>>) => {
            return {
                value: {
                    times: action.payload
                }
            }
        }
    }
})

export const { setTimes } = swim.actions;
export default swim.reducer;