import { combineReducers } from '@reduxjs/toolkit';

import appearanceReducer from './appearance.slice';
import authReducer from './auth.slice';

const rootReducer = combineReducers({
  appearance: appearanceReducer,
  auth: authReducer,
});

export default rootReducer;
