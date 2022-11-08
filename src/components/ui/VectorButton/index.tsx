import React from 'react';
import classNames from 'classnames';

import Clickable, { ClickCallback } from 'app/components/utils/Clickable';
import Vector, { VectorSize } from 'app/components/ui/Vector';

import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export interface VectorButtonProps {
  /** Название векторного изображения с папки `assets/images/vector`, или же полный путь (URL) */
  src: string;

  /** Тип кнопки */
  type?: 'green';

  /** Размер изображения */
  size?: VectorSize;

  /** Callback для клика и нажатий Enter / Space */
  onClick?: ClickCallback;

  /** Отключена ли функциональность */
  disabled?: boolean;
}

/** Кнопка-Vector */
const VectorButton: React.FC<VectorButtonProps> = ({
  src,
  onClick,
  type = 'green',
  size,
  disabled = false,
}) => {
  return (
    <Clickable disabled={disabled} cursor={disabled ? 'default' : 'pointer'} onClick={onClick}>
      <div
        className={classNames(styles.vectorButton, {
          [styles.disabled]: disabled,
          [styles.green]: type === 'green',
        })}
        style={{ height: size, width: size }}
      >
        <Vector src={src} color="var(--vector-color)" size={size} />
      </div>
    </Clickable>
  );
};

export default deepMemo(VectorButton);
