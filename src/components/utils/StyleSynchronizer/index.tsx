import type React from 'react';
import { useMediaQuery } from '@mantine/hooks';

import { styleVariables } from 'app/lib/constants';
import { useAppDispatch, useEvent, useMountEffect, useTheme } from 'app/lib/hooks';
import { matchMediaQuery, deepMemo, storage } from 'app/lib/utils';
import { type RemoveListenerCallback } from 'app/lib/utils/misc/matchMediaQuery/matchMediaQuery';
import { setBreakpoint } from 'app/redux/reducers/appearance.slice';
import { type ThemeId, type BreakpointName, type ColorScheme } from 'app/types';

/**
 * Генератор медиавыражений для контрольных точек
 *
 * @param breakpoint - Название контрольной точки
 * @returns Медиавыражение для указанной котрольной точки
 */
const buildBreakpointQuery = (breakpoint: BreakpointName): string => {
  const bounds = styleVariables.BREAKPOINT_BOUNDS[breakpoint];
  const conditions: string[] = [];

  if (bounds.minWidth) {
    conditions.push(`(min-width: ${bounds.minWidth})`);
  }

  if (bounds.maxWidth) {
    conditions.push(`(max-width: ${bounds.maxWidth})`);
  }

  return conditions.join(' and ');
};

/**
 * Функция для определения темы по умолчанию
 *
 * @param prefersDarkScheme - Предпочтительно ли использовать тёмные темы
 * @returns ID темы, которую стоит использовать
 *
 * @throws {@link Error}
 * Выбрасывается в случае если тема не объявлена
 */
const getDefaultTheme = (prefersDarkScheme: boolean): ThemeId => {
  const colorScheme: ColorScheme = prefersDarkScheme ? 'dark' : 'light';
  const defaultTheme = styleVariables.DEFAULT_THEMES[colorScheme];

  for (const theme of Object.values(styleVariables.THEMES)) {
    if (theme.id === defaultTheme) {
      return theme.camelId;
    }
  }

  throw new Error(`Тема '${defaultTheme}' используется по умолчанию, но при этом не объявлена`);
};

/** Связующее звено между SCSS и React */
const StyleSynchronizer: React.FC = () => {
  const dispatch = useAppDispatch();
  const prefersDarkScheme = useMediaQuery('(prefers-color-scheme: dark)');
  const { themeId, setTheme } = useTheme();

  const handleChangeBreakpointMedia = useEvent((matches: boolean, breakpoint: BreakpointName) => {
    // Сюда будут приходить изменения всех `MediaQuery`. В том числе, где `matches == false`
    if (matches) {
      dispatch(setBreakpoint(breakpoint));
    }
  });

  useMountEffect(() => {
    // Массив, в котором будут хранится все слушатели, которые необходимо будет отвязать позже
    const removeCallbacks: RemoveListenerCallback[] = [];
    const storedThemeId = storage.get<ThemeId>('theme-id');

    for (const breakpoint of styleVariables.BREAKPOINT_NAMES) {
      const query = buildBreakpointQuery(breakpoint);
      const [matches, removeListener] = matchMediaQuery(query, (event) => {
        handleChangeBreakpointMedia(event.matches, breakpoint);
      });

      // Первый раз необходимо проверить вручную
      handleChangeBreakpointMedia(matches, breakpoint);
      removeCallbacks.push(removeListener);
    }

    if (themeId !== storedThemeId) {
      if (storedThemeId) {
        setTheme(storedThemeId);
      } else {
        setTheme(getDefaultTheme(prefersDarkScheme), false);
      }
    }

    return () => {
      for (const removeListener of removeCallbacks) {
        removeListener();
      }
    };
  });

  return null;
};

export default deepMemo(StyleSynchronizer);
