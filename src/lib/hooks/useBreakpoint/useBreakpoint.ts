import { useDebugValue } from 'react';

import { styleVariables } from 'app/lib/constants';
import { useAppSelector } from 'app/lib/hooks';
import { selectBreakpoint } from 'app/redux/reducers/appearance.slice';
import { type BreakpointName } from 'app/types';

const breakpointToIndex = new Map<BreakpointName, number>();
for (let i = 0; i < styleVariables.BREAKPOINT_NAMES.length; i++) {
  const breakpoint = styleVariables.BREAKPOINT_NAMES[i];
  breakpointToIndex.set(breakpoint, i);
}

/**
 * Получение индекса
 *
 * @param breakpoint - Название ключевой точки
 * @returns Индекс в массиве ключевых точек
 */
const getBreakpintIndex = (breakpoint: BreakpointName): number => {
  const breakpointIndex = breakpointToIndex.get(breakpoint);
  if (typeof breakpointIndex === 'undefined') {
    const breakpointNames = styleVariables.BREAKPOINT_NAMES.join(', ');
    throw new Error(`Контрольная точка '${breakpoint}' не найдена, доступные: ${breakpointNames}`);
  }

  return breakpointIndex;
};

interface Breakpoint {
  /** Текущий размер экрана */
  breakpoint: BreakpointName;

  /** Проверяет больше ли текущий размер окна, чем указанный (включительно) */
  isBreakpointBiggerThen: (breakpoint: BreakpointName) => boolean;

  /** Проверяет меньше ли текущий размер окна, чем указанный (включительно) */
  isBreakpointSmallerThen: (breakpoint: BreakpointName) => boolean;

  /** Проверяет находится ли текущий размер окна в промежутке между указанными (включительно) */
  isBreakpointBetween: (lowerBreakpoint: BreakpointName, upperBreakpoint: BreakpointName) => boolean;
}

/**
 * Получение {@link BreakpointName | размера экрана}
 * @returns Текущий {@link BreakpointName | размер экрана} и утилиты для работы с ним
 */
const useBreakpoint = (): Readonly<Breakpoint> => {
  const breakpoint = useAppSelector(selectBreakpoint);
  const breakpointIndex = getBreakpintIndex(breakpoint);

  /** Проверяет больше ли текущий размер окна, чем указанный (включительно) */
  const isBreakpointBiggerThen = (breakpointB: BreakpointName): boolean => {
    const breakpointBIndex = getBreakpintIndex(breakpointB);
    return breakpointIndex >= breakpointBIndex;
  };

  /** Проверяет меньше ли текущий размер окна, чем указанный (включительно) */
  const isBreakpointSmallerThen = (breakpointB: BreakpointName): boolean => {
    const breakpointBIndex = getBreakpintIndex(breakpointB);
    return breakpointIndex <= breakpointBIndex;
  };

  /** Проверяет находится ли текущий размер окна в промежутке между указанными (включительно) */
  const isBreakpointBetween = (lowerBreakpoint: BreakpointName, upperBreakpoint: BreakpointName): boolean => {
    return isBreakpointBiggerThen(lowerBreakpoint) && isBreakpointSmallerThen(upperBreakpoint);
  };

  useDebugValue(breakpoint);
  return { breakpoint, isBreakpointBiggerThen, isBreakpointSmallerThen, isBreakpointBetween } as const;
};

export default useBreakpoint;
