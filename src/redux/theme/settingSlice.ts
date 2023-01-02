import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from '../store'

interface SettingState {
  dialogOpened: boolean;
}

const initialState: SettingState = {
  dialogOpened: false
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setDialogOpened: (state, action: PayloadAction<boolean>) => {
      state.dialogOpened = action.payload;
    }
  },
});

export const { setDialogOpened } = settingSlice.actions;

export default settingSlice.reducer;
