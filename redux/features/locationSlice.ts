import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import locations from "@/locations.json"

const defaultTimezone =
  (locations as { default?: boolean; timezone: string }[]).find(l => l.default)?.timezone ??
  "America/New_York"

const locationSlice = createSlice({
  name: "location",
  initialState: { timezone: defaultTimezone },
  reducers: {
    setTimezone: (state, action: PayloadAction<string>) => {
      state.timezone = action.payload
    }
  }
})

export const { setTimezone } = locationSlice.actions
export default locationSlice.reducer
