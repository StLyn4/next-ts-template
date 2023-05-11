import React from 'react';

import { deepMemo } from 'app/lib/utils';

export interface DividerProps {
  /** Направление линии */
  direction?: 'horizontal' | 'vertical';

  /** Цвет линии */
  color?: string;

  /** Длина по основной оси, CSS-свойство */
  length?: number | string;

  /** Толщина по основной оси, CSS-свойство */
  thickness?: number | string;
}

/**
 * Линия-разделитель
 */
const Divider: React.FC<DividerProps> = ({
  direction = 'horizontal',
  color = '#000000',
  length = '100%',
  thickness = '1px',
}) => {
  // Если длина/ширина - число, то оборачиваем его в строчку с "px" в конце
  let dividerLength = typeof length === 'number' ? `${length}px` : length;
  let dividerThickness = typeof thickness === 'number' ? `${thickness}px` : thickness;

  if (direction === 'vertical') {
    // Длина становится толщиной, а толщина - длиной
    [dividerLength, dividerThickness] = [dividerThickness, dividerLength];
  }

  return (
    <div
      role="separator"
      style={{
        width: dividerLength,
        minHeight: dividerThickness,
        height: dividerThickness,
        background: color,
      }}
    />
  );
};

export default deepMemo(Divider);
