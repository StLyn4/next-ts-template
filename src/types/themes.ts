/** Название темы оформления */
export type ThemeName = 'light';

/** Переменные темы оформления */
export interface ThemeInfo {
  white: string;
  black: string;
  black2: string;
  black3: string;
  black4: string;
  black5: string;
  purple: string;
  purple2: string;
  purple3: string;
  purple4: string;
  purple5: string;
  darkBlue: string;
  darkBlue2: string;
  darkBlue3: string;
  darkBlue4: string;
  darkBlue5: string;
  blue: string;
  blue2: string;
  blue3: string;
  blue4: string;
  blue5: string;
  green: string;
  green2: string;
  green3: string;
  green4: string;
  green5: string;
  yellow: string;
  yellow2: string;
  yellow3: string;
  yellow4: string;
  yellow5: string;
  orange: string;
  orange2: string;
  orange3: string;
  orange4: string;
  orange5: string;
  red: string;
  red2: string;
  red3: string;
  red4: string;
  red5: string;
  darkRed: string;
}

/** Цвета, доступные в теме */
export type ThemeColor = keyof ThemeInfo;

/** Темы оформления */
export type Themes = Record<ThemeName, ThemeInfo>;
