import React from 'react';
import classNames from 'classnames';

import { clamp, deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export interface CircularProgressBarProps {
  /** Степень заполнения **от 0.0 до 1.0** */
  progress: number;

  /** Размер (ширина и высота) */
  size: number;

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

  /** Заполнение по часовой стрелке */
  clockwise?: boolean;
}

/** Круглый прогресс бар */
const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  progress,
  size,
  children = '',
  className = '',
  blankColor = '#F0F0F0',
  filledColor = '#FFBA0A',
  thickness = 3,
  clockwise = true,
}) => {
  const clampedProgress = clamp(progress, 0, 1);
  const halfSize = size / 2;
  const radius = (size - thickness) / 2;
  const viewBox = `0 0 ${size} ${size}`;
  const dashArray = radius * Math.PI * 2;
  const dashOffset = (dashArray - dashArray * clampedProgress) * (clockwise ? 1 : -1);

  const halfSizePx = `${halfSize}px`;
  const radiusPx = `${radius}px`;
  const thicknessPx = `${thickness}px`;

  return (
    <div
      className={classNames(styles.circularProgressBar, className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={clampedProgress}
      aria-label={children}
    >
      <svg viewBox={viewBox} width="100%" height="100%">
        <circle
          className={styles.background}
          cx={halfSizePx}
          cy={halfSizePx}
          r={radiusPx}
          strokeWidth={thicknessPx}
          style={{
            stroke: blankColor,
          }}
        />
        <circle
          className={styles.progress}
          cx={halfSizePx}
          cy={halfSizePx}
          r={radiusPx}
          strokeWidth={thicknessPx}
          transform={`rotate(-90 ${halfSize} ${halfSize})`}
          style={{
            stroke: filledColor,
            strokeDasharray: dashArray,
            strokeDashoffset: dashOffset,
          }}
        />

        {children ? (
          <text className={styles.text} x="50%" y="50%" dy=".3em" textAnchor="middle">
            {children}
          </text>
        ) : null}
      </svg>
    </div>
  );
};

export default deepMemo(CircularProgressBar);
