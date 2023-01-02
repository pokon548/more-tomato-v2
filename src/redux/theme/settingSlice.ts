import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from '../store'

interface SettingState {
  dialogOpened: boolean;
  liftSongDialogOpened: boolean;
  playSound: boolean;
  playSoundVolume: number;
}

const initialState: SettingState = {
  dialogOpened: false,
  liftSongDialogOpened: false,
  playSound: false,
  playSoundVolume: 1
};

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    setDialogOpened: (state, action: PayloadAction<boolean>) => {
      state.dialogOpened = action.payload;
    },
    setLiftSongDialogOpened: (state, action: PayloadAction<boolean>) => {
      state.liftSongDialogOpened = action.payload;
    },
    setPlaySound: (state, action: PayloadAction<boolean>) => {
      state.playSound = action.payload;
    },
    setPlaySoundVolume: (state, action: PayloadAction<number>) => {
      state.playSoundVolume = action.payload
    }
  },
});

export const { setDialogOpened, setLiftSongDialogOpened, setPlaySound, setPlaySoundVolume } = settingSlice.actions;

export default settingSlice.reducer;
