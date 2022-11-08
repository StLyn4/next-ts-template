import { useDebugValue } from 'react';

import { useAppDispatch, useAppSelector, useEvent } from 'app/lib/hooks';

import { selectTheme } from 'app/redux/selectors';
import { setTheme } from 'app/redux/actions';

import { ThemeName, ThemeInfo } from 'app/types';

export type ThemeSetter = (theme: ThemeName) => void;

/**
 * Получение информации о теме оформления
 * @returns Название и переменные текущей темы, функция для её смены
 */
const useTheme = (): readonly [ThemeName, ThemeInfo, ThemeSetter] => {
  const dispatch = useAppDispatch();
  const [themeName, themeInfo] = useAppSelector(selectTheme);

  const themeSetter = useEvent((theme: ThemeName) => {
    dispatch(setTheme(theme));
  });

  useDebugValue(themeName);
  return [themeName, themeInfo, themeSetter] as const;
};

export default useTheme;
