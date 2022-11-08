import { useRef, useInsertionEffect, useCallback } from 'react';

import { GenericFunction, RestedFunction } from 'app/types';

/**
 * Работает как {@link useCallback}, но имеет несколько отличий:
 * - Возвращаемая функция имеет постоянную ссылку (то есть, не заставляет компоненты перерисовываться)
 * - Не использует список зависимостей
 * - Внешние переменные всегда актуальны
 *
 * @param handler - Функция-обработчик
 * @returns Неизменяемая ссылка на функцию
 */
const useEvent = <Func extends GenericFunction>(handler: Func): RestedFunction<Func> => {
  const handlerRef = useRef<Func>(handler);

  useInsertionEffect(() => {
    handlerRef.current = handler;
  });

  return useCallback((...args) => {
    const fn = handlerRef.current;

    // Тип возвращаемого значения будет уточнён в момент вызова `useEvent` с переданного обработчика
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return fn(...args);
  }, []);
};

export default useEvent;
