import { combineReducers } from '@reduxjs/toolkit';

import breakpointReducer from './breakpoint.slice';
import themeReducer from './theme.slice';

const rootReducer = combineReducers({
  breakpoint: breakpointReducer,
  theme: themeReducer,
});

export default rootReducer;
