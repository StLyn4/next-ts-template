import { useDebugValue } from 'react';

import { useConstant, useEvent } from 'app/lib/hooks';

import { GenericFunction } from 'app/types';

export interface StateHolder<T> {
  // Состояние в момент обращения
  value: T;
}

export type InitialStateSetter<T> = () => T;
export type NewStateSetter<T> = (prevState: T) => T;
export type InitialState<T> = Exclude<T, GenericFunction> | InitialStateSetter<T>;
export type NewState<T> = Exclude<T, GenericFunction> | NewStateSetter<T>;
export type StateSetter<T> = (newState: NewState<T>) => void;

export const isInitialStateSetter = <T>(initialState: InitialState<T>): initialState is InitialStateSetter<T> => {
  return typeof initialState === 'function';
};

export const isNewStateSetter = <T>(newState: NewState<T>): newState is NewStateSetter<T> => {
  return typeof newState === 'function';
};

/**
 * Аналог useState, но изменение состояния не запускает повторный рендер
 *
 * @remarks
 * Текущее значение необходимо получать через поле `value`.
 * Т.е., вместо обычного `state` нужно использовать `state.value`
 *
 * @param initialState - Начальное состояние, либо же функция, которая его задаст (выполняется единожды)
 * @returns Состояние и функция для её изменения
 */
const useUntrackedState = <T>(initialState: InitialState<T>): readonly [StateHolder<T>, StateSetter<T>] => {
  const valueHolder = useConstant<StateHolder<T>>(() => {
    if (isInitialStateSetter(initialState)) {
      return { value: initialState() };
    } else {
      return { value: initialState };
    }
  });

  const setter = useEvent((newState: NewState<T>) => {
    if (isNewStateSetter(newState)) {
      valueHolder.value = newState(valueHolder.value);
    } else {
      valueHolder.value = newState;
    }
  });

  useDebugValue(valueHolder);
  return [valueHolder, setter] as const;
};

export default useUntrackedState;
