import React from 'react';

import { useEvent } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export type ClickEvent = React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>;
export type ClickCallback = (event: ClickEvent) => void | Promise<void>;

export const isMouseEvent = (event: ClickEvent): event is React.MouseEvent<HTMLDivElement> => {
  return 'screenX' in event;
};

export const isKeyboardEvent = (event: ClickEvent): event is React.KeyboardEvent<HTMLDivElement> => {
  return 'key' in event;
};

export interface ClickableProps {
  /** Содержимое */
  children: React.ReactNode;

  /** Callback для клика и нажатий Enter / Space */
  onClick?: ClickCallback;

  /** Отключена ли функциональность */
  disabled?: boolean;

  /** Какой курсор использовать при наведении на зону */
  cursor?: string;
}

/**
 * Компонент, который отлавливает клики на содержимое и нажатия Enter / Space при фокусе
 */
const Clickable: React.FC<ClickableProps> = ({ children, onClick, disabled = false, cursor = 'pointer' }) => {
  const handleClick = useEvent((event: ClickEvent) => {
    if (!disabled && typeof onClick === 'function') {
      // Явно игнорируем возращённое значение из onClick
      void onClick(event);
    }
  });

  const handleKeyPress = useEvent((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      handleClick(event);
    }
  });

  return (
    <div
      role="button"
      className={styles.clickable}
      style={{ cursor: disabled ? 'default' : cursor }}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {children}
    </div>
  );
};
export default deepMemo(Clickable);
