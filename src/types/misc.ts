import type Image from 'next/image';

import { type GenericFunction } from 'app/types';

// `enterKeyHint` на момент написания отсутствует в типизации для `textarea`
declare global {
  namespace React {
    interface TextareaHTMLAttributes<T> {
      enterKeyHint: InputHTMLAttributes<T>['enterKeyHint'];
    }
  }
}

/** Изображение для next/image */
export type ImageSource = React.ComponentProps<typeof Image>['src'];

/** Функция, которая вернёт начальное значение для состояния */
export type InitialStateSetter<T> = () => T;

/** Функция, которая вернёт новое значение для состояния */
export type NewStateSetter<T> = (prevState: T) => T;

/** Начальное значение для состояния, либо же функция, которая вернёт его */
export type InitialState<T> = Exclude<T, GenericFunction> | InitialStateSetter<T>;

/** Новое значение для состояния, либо же функция, котороя вернёт новое значение */
export type NewState<T> = Exclude<T, GenericFunction> | NewStateSetter<T>;

/** Функция для обновления состояниями */
export type StateSetter<T> = (newState: NewState<T>) => void;
