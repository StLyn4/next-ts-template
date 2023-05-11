import { type CamelCase } from 'ts-essentials';

import type ThemeExtendedPallet from './extended-pallet';
import type ThemePallet from './pallet';

export type { ThemeExtendedPallet, ThemePallet };

/** Цветовая схема браузера */
export type ColorScheme = 'light' | 'dark';

/** Уникальный ID темы оформления */
export type OriginalThemeId = 'tailwind-light';

/** Уникальный ID темы оформления в формате camelCase */
export type ThemeId = CamelCase<OriginalThemeId>;

/** Темы по умолчанию для разных цветовых схем браузера */
export type DefaultThemes = Record<ColorScheme, OriginalThemeId>;

/** Тема оформления */
export interface Theme {
  /** Уникальный ID темы */
  id: OriginalThemeId;

  /** Уникальный ID темы в формате camelCase */
  camelId: ThemeId;

  /** Человекочитаемое название темы */
  name: string;

  /** Цветовая схема темы */
  colorScheme: ColorScheme;

  /** Палитра цветов */
  pallet: ThemePallet;

  /** Палитра цветов в расширенном формате */
  extendedPallet: ThemeExtendedPallet;
}

/** Названия цветов, доступных в теме */
export type ThemeColor = keyof ThemePallet;

/** Темы оформления */
export type Themes = Record<ThemeId, Theme>;
