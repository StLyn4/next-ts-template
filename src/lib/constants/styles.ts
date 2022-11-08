import { DeepReadonly } from 'ts-essentials';

import { StyleVariableError } from 'app/lib/errors';
import trimQuotes from 'app/lib/utils/string/trimQuotes';
import { parseArray, parseDuration, parseObject } from 'app/lib/utils/string/parsers';

import { Themes } from 'app/types';

import variables from 'app/styles/export.module.scss';

interface StyleVariables {
  /** Стандартное время перехода анимаций */
  TRANSITION_TIME: number;

  /** Функция расчёта промежуточных значений анимации */
  TRANSITION_TIMING_FUNCTION: string;

  /** Параметры функции расчёта промежуточных значений анимации */
  TRANSITION_TIMING_FUNCTION_ARGS: number[];

  /** Максимальная ширина экрана телефона */
  MOBILE_BREAKPOINT: string;

  /** Максимальная ширина экрана планшета */
  TABLET_BREAKPOINT: string;

  /** Media query для определения телефона */
  MOBILE_BREAKPOINT_CONDITION: string;

  /** Media query для определения планшета */
  TABLET_BREAKPOINT_CONDITION: string;

  /** Media query для определения ПК */
  DESKTOP_BREAKPOINT_CONDITION: string;

  /** Темы оформления */
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
  TRANSITION_TIME: parseDuration(getStyleVariable('transitionTime')),
  TRANSITION_TIMING_FUNCTION: getStyleVariable('transitionTimingFunction'),
  TRANSITION_TIMING_FUNCTION_ARGS: parseArray<number>(getStyleVariable('transitionTimingFunctionArgs')),
  MOBILE_BREAKPOINT: getStyleVariable('mobileBreakpoint'),
  TABLET_BREAKPOINT: getStyleVariable('tabletBreakpoint'),
  MOBILE_BREAKPOINT_CONDITION: getStyleVariable('mobileCondition'),
  TABLET_BREAKPOINT_CONDITION: getStyleVariable('tabletCondition'),
  DESKTOP_BREAKPOINT_CONDITION: getStyleVariable('desktopCondition'),
  THEMES: parseObject<Themes>(getStyleVariable('themes')),
};

export default styleVariables;
