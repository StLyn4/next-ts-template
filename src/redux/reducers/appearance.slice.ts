import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';

import { styleVariables } from 'app/lib/constants';
import { storage } from 'app/lib/utils';
import { type RootState } from 'app/redux/store';
import { type BreakpointName, type ThemeId } from 'app/types';

export interface SetThemeParams {
  /** ID новой темы */
  theme: ThemeId;

  /** Стоит ли сохранить настройки темы */
  persist: boolean;
}

interface AppearanceState {
  /** Название текущей контрольной точки окна */
  breakpoint: BreakpointName;

  /** ID текущей темы оформления */
  theme: ThemeId;
}

const initialState: AppearanceState = {
  breakpoint: 'xs',
  theme: 'tailwindLight',
};

const appearance = createSlice({
  name: 'appearance',
  initialState,
  reducers: {
    setBreakpoint: (state: AppearanceState, action: PayloadAction<BreakpointName>) => {
      state.breakpoint = action.payload;
    },

    setTheme: (state: AppearanceState, action: PayloadAction<SetThemeParams>) => {
      const { theme, persist } = action.payload;
      const originalId = styleVariables.THEMES[theme].id;

      state.theme = theme;
      document.documentElement.dataset.theme = originalId;

      if (persist) {
        void storage.set('theme-id', theme);
      }
    },
  },
});

export default appearance.reducer;

export const { setBreakpoint, setTheme } = appearance.actions;

export const selectBreakpoint = createSelector(
  (state: RootState) => state.appearance,
  (appearance) => appearance.breakpoint,
);

export const selectTheme = createSelector(
  (state: RootState) => state.appearance,
  (appearance) => [
    appearance.theme,
    styleVariables.THEMES[appearance.theme],
  ] as const,
);
