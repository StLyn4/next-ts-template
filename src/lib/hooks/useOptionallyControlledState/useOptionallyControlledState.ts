import { useState, useDebugValue } from 'react';

import { useConstant, useEvent } from 'app/lib/hooks';

export type ChangeCallback<T> = (value: T) => void;

const useOptionallyControlledState = <T>(
  controlledValue: T | undefined,
  initialValue: T | undefined,
  onChange?: ChangeCallback<T>,
): readonly [T, ChangeCallback<T>] => {
  const isControlled = typeof controlledValue !== 'undefined';
  const initialIsControlled = useConstant(() => isControlled);
  const [stateValue, setStateValue] = useState(initialValue);

  if (typeof initialValue === 'undefined' && typeof controlledValue === 'undefined') {
    throw new Error('Должно быть указано либо начальное, либо контролируемое значение');
  }

  if (initialIsControlled && !isControlled) {
    throw new Error(
      'Невозможно перейти из контролируемого в неконтролируемый режим. Убедитесь что `undefined` не используется в качестве контролируемого значения. Используйте вместо него `null`, пустую строку, либо же любой другой тип на ваше усмотрение',
    );
  }

  if (!initialIsControlled && isControlled) {
    throw new Error(
      'Невозможно перейти из неконтролируемого в контролируемый режим. Укажите начальное значение, отличное от `undefined`: `null`, пустую строку, либо же любой другой тип на ваше усмотрение',
    );
  }

  // Всегда определено либо `controlledValue`, либо `stateValue`
  const value = isControlled ? controlledValue : stateValue as T;

  const setNewValue = useEvent((newValue: T) => {
    if (!isControlled) {
      setStateValue(newValue);
    }
    if (typeof onChange === 'function') {
      onChange(newValue);
    }
  });

  useDebugValue(value);
  return [value, setNewValue] as const;
};

export default useOptionallyControlledState;
