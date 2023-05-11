import { useState, useDebugValue } from 'react';

import { useConstant, useEvent } from 'app/lib/hooks';

export type ChangeCallback<T> = (value: T) => void;

/**
 * Аналог useState, источником данных для которого является опционально контролируемый компонент
 *
 * @remarks
 * Контролируемый компонент берёт данные с пропсов/контекста/луны, а неконтролируемый - напрямую с DOM.
 * Подробнее: {@link https://goshacmd.com/controlled-vs-uncontrolled-inputs-react}.
 * В большинстве случаев, нативные элементы, как тот же `input` позволяют не передавать им атрибут `value`.
 * В таком случае компонент будет брать данные исключительно с DOM. Этот хук позволяет добиться похожего поведения.
 *
 * Возьмём в качестве примера кастомный компонент `Input`. Пусть он принимает опциональные пропсы `value` и `onChange`.
 * В данном случае необходимо просто передать их в хук в качестве 1-го и 3-го аргументов соответственно.
 * Если же `value` [потенциально] не задан, то также необходимо указать 2-й аргумент - начальное значение.
 * Будут возращены 2 объекта, которые необходимо передать в низлежащий `input` в качестве его `value` и `onChange`:
 *
 * ```jsx
 * const Input = ({ value, onChange }) => {
 *   const [inputValue, inputOnChange] = useOptionallyControlledState(input, '', onChange);
 *   return <input value={inputValue} onChange={inputOnChange} />;
 * }
 * ```
 *
 * @param controlledValue - Текущее значение, которое будет принудительно применено, если указано
 * @param initialValue - Начальное значение, если не указан `controlledValue`
 * @param onChange - Callback на случай изменения значения
 * @returns Состояние и функция для его изменения
 */
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
