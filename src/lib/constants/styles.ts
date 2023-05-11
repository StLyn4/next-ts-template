import { type DeepReadonly } from 'ts-essentials';

import { StyleVariableError } from 'app/lib/errors';
import { trimQuotes } from 'app/lib/utils';
import { parseDuration, parseArray, parseObject } from 'app/lib/utils/string/parsers';
import { type BreakpointName, type Breakpoints, type BreakpointBounds, type DefaultThemes, type Themes } from 'app/types';

import variables from 'app/styles/export.module.scss';

interface StyleVariables {
  /** Стандартное время перехода анимаций */
  TRANSITION_DURATION: number;

  /** Функция расчёта промежуточных значений анимации */
  TRANSITION_TIMING_FUNCTION: string;

  /** Параметры функции расчёта промежуточных значений анимации */
  TRANSITION_TIMING_FUNCTION_ARGS: number[];

  /** Упорядоченный массив контрольных точек вьюпорта */
  BREAKPOINT_NAMES: BreakpointName[];

  /** Границы всех контрольных точек */
  BREAKPOINT_BOUNDS: BreakpointBounds;

  /** Контрольные точки ширины вьюпорта */
  BREAKPOINTS: Breakpoints;

  /** Темы по умолчанию для разных цветовых схем браузера */
  DEFAULT_THEMES: DefaultThemes;

  /** Палитры цветов для всех тем оформления */
  THEMES: Themes;
}

/**
 * Получает переменную стилей
 *
 * @param stylesVariableName - Название экспортированной переменной стилей
 * @returns Значение переменной стилей, или же ошибка, если она не объявлена
 */
const getStyleVariable = (stylesVariableName: string): string => {
  const variable = variables[stylesVariableName];

  if (typeof variable === 'undefined') {
    throw new StyleVariableError(`Переменная стилей не объявлена: ${stylesVariableName}`);
  }

  return trimQuotes(variable);
};

const styleVariables: DeepReadonly<StyleVariables> = {
  TRANSITION_DURATION: parseDuration(getStyleVariable('transitionDuration')),
  TRANSITION_TIMING_FUNCTION: getStyleVariable('transitionTimingFunction'),
  TRANSITION_TIMING_FUNCTION_ARGS: parseArray<number>(getStyleVariable('transitionTimingFunctionArgs')),

  BREAKPOINT_NAMES: parseArray<BreakpointName>(getStyleVariable('breakpointNames')),
  BREAKPOINT_BOUNDS: parseObject<BreakpointBounds>(getStyleVariable('breakpointBounds')),
  BREAKPOINTS: parseObject<Breakpoints>(getStyleVariable('breakpoints')),

  DEFAULT_THEMES: parseObject<DefaultThemes>(getStyleVariable('defaultThemes')),
  THEMES: parseObject<Themes>(getStyleVariable('themes')),
};

export default styleVariables;
