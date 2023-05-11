import type { InitialState, InitialStateSetter, NewState, NewStateSetter } from 'app/types';

/** Проверяет инициировано ли состояние с помощью функции */
export const isInitialStateSetter = <T>(initialState: InitialState<T>): initialState is InitialStateSetter<T> => {
  return typeof initialState === 'function';
};

/** Проверяет изменено ли состояние с помощью функции */
export const isNewStateSetter = <T>(newState: NewState<T>): newState is NewStateSetter<T> => {
  return typeof newState === 'function';
};
