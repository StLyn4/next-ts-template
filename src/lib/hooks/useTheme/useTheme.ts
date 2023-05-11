import { useDebugValue } from 'react';
import { type DeepReadonly } from 'ts-essentials';

import { useAppDispatch, useAppSelector, useEvent } from 'app/lib/hooks';
import { selectTheme, setTheme } from 'app/redux/reducers/appearance.slice';
import { type ThemeId, type Theme } from 'app/types';

export type ThemeSetter = (themeId: ThemeId, persist?: boolean) => void;
export interface ThemeData {
  /** ID темы */
  themeId: ThemeId;

  /** Детальная информация о теме */
  theme: Theme;

  /** Функция для изменения темы на указанную */
  setTheme: ThemeSetter;
}

/**
 * Получение информации о теме оформления
 * @returns Название и палитра цветов текущей темы, а также функция для смены темы
 */
const useTheme = (): DeepReadonly<ThemeData> => {
  const dispatch = useAppDispatch();
  const [themeId, theme] = useAppSelector(selectTheme);

  const themeSetter = useEvent<ThemeSetter>((themeId, persist = true) => {
    dispatch(setTheme({ theme: themeId, persist }));
  });

  useDebugValue(themeId);
  return { themeId, theme, setTheme: themeSetter } as const;
};

export default useTheme;
