import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';

import { styleVariables } from 'app/lib/constants';

import { RootState } from 'app/redux/store';

import { ThemeName } from 'app/types';

interface ThemeState {
  /** Название темы оформления */
  currentTheme: ThemeName;
}

const initialState: ThemeState = {
  currentTheme: 'light',
};

const theme = createSlice({
  name: 'responsive',
  initialState,
  reducers: {
    setTheme: (state: ThemeState, action: PayloadAction<ThemeName>) => {
      state.currentTheme = action.payload;
      document.documentElement.dataset.theme = action.payload;
    },
  },
});

export default theme.reducer;

export const { setTheme } = theme.actions;

export const selectTheme = createSelector(
  (state: RootState) => state.theme,
  (theme) => [theme.currentTheme, styleVariables.THEMES[theme.currentTheme]] as const,
);
