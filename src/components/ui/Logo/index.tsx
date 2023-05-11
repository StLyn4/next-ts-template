import React from 'react';
import { type DeepReadonly } from 'ts-essentials';

import Vector from 'app/components/ui/Vector';
import { useTheme } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';
import { type ThemeColor } from 'app/types';

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
    color: 'emerald600',
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
  const { theme } = useTheme();

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

  return (
    <div className={styles.logo} style={{ width: logoWidth, height: logoHeight }}>
      <Vector src="common/logo" color={theme.pallet[color]} />
    </div>
  );
};

export default deepMemo(Logo);
