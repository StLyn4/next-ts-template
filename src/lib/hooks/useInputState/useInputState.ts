import { useEffect, useState } from 'react';
import { useDebouncedCallback, type DebouncedState } from 'use-debounce';

import { type InputValidatorCallback } from 'app/components/input/types';
import { useEvent, useOptionallyControlledState } from 'app/lib/hooks';

export interface InputState<T = string> {
  /** Текущее значение */
  value: T;

  /** Текущая ошибка */
  error: string;

  /** Функция для обработки новых значений */
  handleChange: (value: T) => void;

  /** Функция для обработки новых значений с задержкой */
  handleDebouncedChange: DebouncedState<(value: T) => void>;

  /** Функция для валидации текущего / указанного значения */
  handleValidate: (value?: T) => string | null;

  /** Функция для валидации текущего / указанного значения с задержкой */
  handleDebouncedValidate: DebouncedState<(value?: T) => void>;

  /** Функция для скрытия текущей ошибки */
  handleHideError: () => void;
}

/**
 * Управляет вводом данных и их валидацией в компонентах по типу `Input`
 *
 * @param controlledValue - Текущее значение, которое будет принудительно применено, если указано
 * @param initialValue - Начальное значение, если не указан `controlledValue`
 * @param errorMessage - Текущая ошибка ввода
 * @param debounceTimeout - Время минимальной задержки между вызовами `onDebouncedChange` и `validator` в мс
 * @param onChange - Callback на случай изменения поля
 * @param onDebouncedChange - Callback на случай изменения поля с debounce эффектом
 * @param validator - Валидатор содержимого
 * @returns Состояние ввода и функции для управления им
 */
const useInputState = <T = string>(
  controlledValue?: T,
  initialValue?: T,
  errorMessage = '',
  debounceTimeout = 500,
  onChange?: (value: T) => void,
  onDebouncedChange?: (value: T) => void | Promise<void>,
  validator?: InputValidatorCallback<T>,
): InputState<T> => {
  const [value, setValue] = useOptionallyControlledState(controlledValue, initialValue, onChange);
  const [error, setError] = useState(errorMessage);

  const handleHideError = useEvent(() => {
    setError('');
  });

  const handleValidate = useEvent((validationValue: T = value): string | null => {
    // Если ожидался запуск валидатора через `handleDebouncedValidate`, то отменяем его
    handleDebouncedValidate.cancel();

    if (typeof validator !== 'undefined') {
      const validationError = validator(validationValue);

      if (validationError) {
        setError(validationError);
      } else {
        handleHideError();
      }

      return validationError || null;
    }

    return null;
  });

  const handleDebouncedValidate = useDebouncedCallback((validationValue: T = value): void => {
    handleValidate(validationValue);
  }, debounceTimeout);

  const handleChange = useEvent((value: T): void => {
    setValue(value);
    handleDebouncedChange(value);
    handleDebouncedValidate(value);
  });

  const handleDebouncedChange = useDebouncedCallback((value: T): void => {
    if (onDebouncedChange) {
      void onDebouncedChange(value);
    }
  }, debounceTimeout);

  useEffect(() => {
    setError(errorMessage);
  }, [errorMessage]);

  return {
    value,
    error,
    handleChange,
    handleDebouncedChange,
    handleValidate,
    handleDebouncedValidate,
    handleHideError,
  } as const;
};

export default useInputState;
