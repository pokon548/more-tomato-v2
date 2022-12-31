import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from '../store'

export const TYPE_GRADIENT = 0;
export const TYPE_UNSPLASH = 1;

interface ThemeState {
  type: number;
  theme: string;
}

const initialState: ThemeState = {
  type: TYPE_GRADIENT,
  theme: "blue",
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setType: (state, action: PayloadAction<number>) => {
      state.type = action.payload;
    },
    setTheme: (state, action: PayloadAction<string>) => {
      state.theme = action.payload;
    },
  },
});

export const { setType, setTheme } = themeSlice.actions;

export const themeType = (state: RootState) => state.theme.type;

export default themeSlice.reducer;
