import { createSlice, createSelector, type PayloadAction } from '@reduxjs/toolkit';

import { type RootState } from 'app/redux/store';

// TODO: Заглушка - заменить на тип Strapi
interface User {
  /** Имя */
  firstName: string;

  /** Фамилия */
  lastName: string;

  /** Почта */
  email: string;
}

interface UserState {
  /** Токен авторизации (JWT) */
  token: string | null;

  /** Текущий авторизированный пользователь */
  user: User | null;
}

const initialState: UserState = {
  token: null,
  user: null,
};

const auth = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state: UserState, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUser: (state: UserState, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export default auth.reducer;

export const { setToken, setUser } = auth.actions;

export const selectUser = createSelector(
  (state: RootState) => state.auth,
  (auth) => auth.user,
);
