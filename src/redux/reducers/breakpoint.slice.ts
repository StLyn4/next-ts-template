import { createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from 'app/redux/store';

import { WindowBreakpoint } from 'app/types';

interface BreakpointState {
  /** Размер окна */
  currentBreakpoint: WindowBreakpoint;
}

const initialState: BreakpointState = {
  currentBreakpoint: 'mobile',
};

const breakpoint = createSlice({
  name: 'responsive',
  initialState,
  reducers: {
    setBreakpoint: (state: BreakpointState, action: PayloadAction<WindowBreakpoint>) => {
      state.currentBreakpoint = action.payload;
    },
  },
});

export default breakpoint.reducer;

export const { setBreakpoint } = breakpoint.actions;

export const selectBreakpoint = createSelector(
  (state: RootState) => state.breakpoint,
  (breakpoint) => breakpoint.currentBreakpoint,
);
