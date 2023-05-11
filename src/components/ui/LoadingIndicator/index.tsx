import React from 'react';

import Vector, { type VectorSize } from 'app/components/ui/Vector';
import { deepMemo } from 'app/lib/utils';

// Тип индикатора - название файла в папке `assets/images/vector/loaders`
export type LoadingIndicatorTypes = 'material' | 'oval' | 'tail' | 'puff' | 'dots' | 'bars';

export interface LoadingIndicatorProps {
  /** Тип индикатора */
  type?: LoadingIndicatorTypes;

  /** Цвет индикатора, CSS */
  color?: string;

  /** Размер индикатора */
  size?: VectorSize;
}

/**
 * Индикатор загрузки
 *
 * @remarks
 * Для добавления новых индикаторов (SVG)
 * поместите их в папку `assets/images/vector/loaders`
 * и зарегистрируйте их в {@link LoadingIndicatorTypes}
 */
const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  type = 'material',
  color = 'currentColor',
  size = '100%',
}) => {
  return <Vector src={`loaders/${type}`} color={color} size={size} />;
};

export default deepMemo(LoadingIndicator);
