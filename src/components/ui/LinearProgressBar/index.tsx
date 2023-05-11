import React from 'react';
import classNames from 'classnames';

import { clamp, deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export interface LinearProgressBarProps {
  /** Степень заполнения **от 0.0 до 1.0** */
  progress: number;

  /** Текст внутри */
  children?: string;

  /** Дополнительные CSS-классы */
  className?: string;

  /** Цвет незаполненной области */
  blankColor?: string;

  /** Цвет заполненной области */
  filledColor?: string;

  /** Ширина полоски */
  thickness?: number;
}

/** Линейный прогресс бар */
const LinearProgressBar: React.FC<LinearProgressBarProps> = ({
  progress,
  children = '',
  className = '',
  blankColor = '#F0F0F0',
  filledColor = '#FFBA0A',
  thickness = 3,
}) => {
  const clampedProgress = clamp(progress, 0, 1);

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={clampedProgress}
      aria-label={children}
      className={classNames(styles.linearProgressBar, className)}
    >
      {children && (
        <span className={styles.text}>
          {children}
        </span>
      )}
      <div className={styles.progressBackground} style={{ height: thickness, background: blankColor }}>
        <div
          className={styles.progress}
          style={{ width: `${clampedProgress * 100}%`, height: thickness, background: filledColor }}
        />
      </div>
    </div>
  );
};

export default deepMemo(LinearProgressBar);
