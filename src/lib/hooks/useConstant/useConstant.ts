import { useDebugValue, useRef } from 'react';

/**
 * Аналог useMemo, но при этом никогда не обновляет переданное значение
 *
 * @param factory - Функция, которая возвращает значение для запоминания
 * @returns Значение, которое не меняется между перерисовками
 */
const useConstant = <T>(factory: () => T): T => {
  const ref = useRef<T | null>(null);

  if (!ref.current) {
    ref.current = factory();
  }

  useDebugValue(ref.current);
  return ref.current;
};

export default useConstant;
