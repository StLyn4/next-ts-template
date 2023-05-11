import { type DependencyList } from 'react';
import isDeepEqual from 'fast-deep-equal';
import { useCustomCompareMemo } from 'use-custom-compare';

/**
 * Аналог useMemo, но с глубоким сравнением списка зависимостей
 *
 * @param factory - Функция, которая возвращает значение для запоминания
 * @param deps - Список зависимостей хука
 * @returns Значение, которое не меняется между перерисовками, если список зависимостей не изменился
 */
const useDeepMemo = <T, Deps extends DependencyList>(factory: () => T, deps: readonly [...Deps]): T => {
  return useCustomCompareMemo(factory, deps, isDeepEqual);
};

export default useDeepMemo;
