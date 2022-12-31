import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "../store";

interface ClockState {
  inShortTermRelaxing: boolean;
  inLongTermRelaxing: boolean;
  inWorkTerm: boolean;
  inTimeSettingTerm: boolean;
  inWorkTermPause: boolean;
  inRelaxTermPause: boolean;
  inInfiniteCount: boolean;

  needPlaySound: boolean;

  tookShortRelax: boolean;
  nextPhase: string;

  // 时间设置
  shortTermRelaxingTimeInSeconds: number; // 默认为五分钟
  longTermRelaxingTimeInSeconds: number; // 默认为十五分钟
  workTimeInSeconds: number;
  currentTimeInSeconds: number;
}

const initialState: ClockState = {
  inShortTermRelaxing: false,
  inLongTermRelaxing: false,
  inTimeSettingTerm: true,
  inWorkTerm: false,
  inWorkTermPause: false,
  inRelaxTermPause: false,
  inInfiniteCount: false,

  needPlaySound: false,

  nextPhase: "work",
  tookShortRelax: false,
  shortTermRelaxingTimeInSeconds: 5 * 60,
  longTermRelaxingTimeInSeconds: 15 * 60,
  workTimeInSeconds: 25 * 60,

  currentTimeInSeconds: 0,
};

export const clockSlice = createSlice({
  name: "clock",
  initialState,
  reducers: {
    startWorkClock: (state, action: PayloadAction<number>) => {
      const workTimeInSeconds = action.payload;

      state.workTimeInSeconds = workTimeInSeconds;

      state.inShortTermRelaxing = false;
      state.inLongTermRelaxing = false;
      state.inWorkTerm = true;
      state.inWorkTermPause = false;
    },
    startShortRelaxClock: (state, action: PayloadAction<number>) => {
      const shortRelaxTimeInSeconds = action.payload;

      state.workTimeInSeconds = shortRelaxTimeInSeconds;

      state.inShortTermRelaxing = true;
      state.inLongTermRelaxing = false;
      state.inWorkTerm = false;
      state.inWorkTermPause = false;
    },
    startLongRelaxClock: (state, action: PayloadAction<number>) => {
      const longRelaxTimeInSeconds = action.payload;

      state.workTimeInSeconds = longRelaxTimeInSeconds;

      state.inShortTermRelaxing = false;
      state.inLongTermRelaxing = true;
      state.inWorkTerm = false;
      state.inWorkTermPause = false;
    },
    setTookShortRelax: (state, action: PayloadAction<boolean>) => {
      const tookShortRelax = action.payload;

      state.tookShortRelax = tookShortRelax;
    },
    interruptWorkClock: (state) => {
      state.inLongTermRelaxing = false;
      state.inShortTermRelaxing = false;
      state.inWorkTerm = false;
      state.inWorkTermPause = false;
      state.inRelaxTermPause = false;
    },
    setWorkTimeInSeconds: (state, action: PayloadAction<number>) => {
      const timeInSeconds = action.payload;
      state.workTimeInSeconds = timeInSeconds;
    },
    setCurrentTimeInSeconds: (state, action: PayloadAction<number>) => {
      const timeInSeconds = action.payload;
      state.currentTimeInSeconds = timeInSeconds;
    },
    setInShortTermRelaxing: (state, action: PayloadAction<boolean>) => {
      const shortTermRelaxing = action.payload;
      state.inShortTermRelaxing = shortTermRelaxing;
    },
    setInLongTermRelaxing: (state, action: PayloadAction<boolean>) => {
      const shortTermRelaxing = action.payload;
      state.inLongTermRelaxing = shortTermRelaxing;
    },
    setNextPhase: (state, action: PayloadAction<string>) => {
      state.nextPhase = action.payload;
    },
    decreaseCurrentTimeInSeconds: (state) => {
      state.currentTimeInSeconds -= 1;
    },
    pauseClock: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.inRelaxTermPause = true;
      } else {
        state.inWorkTermPause = true;
      }
    },
    resumeClock: (state) => {
      state.inWorkTermPause = false;
      state.inRelaxTermPause = false;
    },
  },
});

export const {
  startWorkClock,
  startShortRelaxClock,
  startLongRelaxClock,
  interruptWorkClock,
  decreaseCurrentTimeInSeconds,
  setInShortTermRelaxing,
  setInLongTermRelaxing,
  setWorkTimeInSeconds,
  setTookShortRelax,
  setNextPhase,
  setCurrentTimeInSeconds,
  pauseClock,
  resumeClock,
} = clockSlice.actions;

export const themeType = (state: RootState) => state.theme.type;

export default clockSlice.reducer;
