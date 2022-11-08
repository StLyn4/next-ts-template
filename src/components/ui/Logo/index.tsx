import React from 'react';
import { DeepReadonly } from 'ts-essentials';

import Vector from 'app/components/ui/Vector';

import { useTheme } from 'app/lib/hooks';
import { pxToRem, deepMemo } from 'app/lib/utils';

import { ThemeColor } from 'app/types';

import styles from './styles.module.scss';

export type LogoTypes = 'blue' | 'white';

export interface LogoProps {
  /** Тип логотипа */
  type?: LogoTypes;

  /** Ширина изображения */
  width?: number;

  /** Высота изображения */
  height?: number;
}

interface LogoInfo {
  /** Название цвета логотипа */
  color: ThemeColor;

  /** Ширина изображения */
  width: number;

  /** Высота изображения */
  height: number;
}

const logos: DeepReadonly<Record<LogoTypes, LogoInfo>> = {
  blue: {
    color: 'darkBlue',
    width: 160,
    height: 26,
  },
  white: {
    color: 'white',
    width: 160,
    height: 26,
  },
};

/**
 * Компонент, отвечающий за логотип
 *
 * @remarks
 * Для добавления новых типов логотипов
 * зарегистрируйте их в {@link LogoTypes} и {@link logos}
 */
const Logo: React.FC<LogoProps> = ({ type = 'blue', width, height }) => {
  const [, themeInfo] = useTheme();

  const { color, width: defaultWidth, height: defaultHeight } = logos[type];
  const ratio = defaultWidth / defaultHeight;

  let logoWidth = defaultWidth;
  let logoHeight = defaultHeight;

  if (typeof width !== 'undefined') {
    logoWidth = width;

    if (typeof height === 'undefined') {
      logoHeight = width / ratio;
    }
  }

  if (typeof height !== 'undefined') {
    logoHeight = height;

    if (typeof width === 'undefined') {
      logoWidth = height * ratio;
    }
  }

  const logoWidthRem = pxToRem(logoWidth);
  const logoHeightRem = pxToRem(logoHeight);

  return (
    <div className={styles.logo} style={{ width: logoWidthRem, height: logoHeightRem }}>
      <Vector src="common/logo" color={themeInfo[color]} />
    </div>
  );
};

export default deepMemo(Logo);
