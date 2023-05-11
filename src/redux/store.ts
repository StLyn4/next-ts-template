import { configureStore } from '@reduxjs/toolkit';

import { env } from 'app/lib/constants';

import rootReducer from './reducers';

/** Хранилище Redux */
const store = configureStore({
  reducer: rootReducer,
  devTools: env.IS_DEVELOPMENT,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
