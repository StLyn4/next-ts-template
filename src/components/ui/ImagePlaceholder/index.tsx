import React from 'react';

import Vector from 'app/components/ui/Vector';

import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export interface ImagePlaceholderProps {
  /** Ширина заглушки */
  width: number;

  /** Высота заглушки */
  height: number;
}

/** Заглушка для изображений */
const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({ width, height }) => {
  const placeholderWidth = Math.max(width, 32);
  const placeholderHeight = Math.max(height, 32);

  return (
    <div className={styles.imagePlaceholder} style={{ width: placeholderWidth, height: placeholderHeight }}>
      <Vector src="common/image" color="#C4C4C4" size={32} />
    </div>
  );
};

export default deepMemo(ImagePlaceholder);
