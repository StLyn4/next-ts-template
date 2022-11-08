import React from 'react';

import { useEvent } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export type HoverEvent = React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>;
export type HoverCallback = (event: HoverEvent) => void | Promise<void>;

export const isMouseEvent = (event: HoverEvent): event is React.MouseEvent<HTMLDivElement> => {
  return 'screenX' in event;
};

export const isTouchEvent = (event: HoverEvent): event is React.TouchEvent<HTMLDivElement> => {
  return 'touches' in event;
};

export interface HoverableProps {
  /** Содержимое */
  children: React.ReactNode;

  /** Callback для наведения */
  onHover?: HoverCallback;

  /** Callback обратный наведению */
  onUnhover?: HoverCallback;
}

/**
 * Компонент, который отлавливает наведение мышки и "неполные" нажатия на сенсорных экранах
 */
const Hoverable: React.FC<HoverableProps> = ({ children, onHover, onUnhover }) => {
  const wrapperRef = React.useRef<HTMLDivElement>(null);

  const handleHover = useEvent((event: HoverEvent) => {
    if (typeof onHover === 'function') {
      // Явно игнорируем возращённое значение из onHover
      void onHover(event);
    }
  });

  const handleUnhover = useEvent((event: HoverEvent) => {
    if (typeof onUnhover === 'function') {
      // Явно игнорируем возращённое значение из onUnhover
      void onUnhover(event);
    }
  });

  const handleTouchEnd = useEvent((event: React.TouchEvent<HTMLDivElement>) => {
    const { current: wrapper } = wrapperRef;

    if (wrapper) {
      const { top, right, bottom, left } = wrapper.getBoundingClientRect();
      const { clientX, clientY } = event.changedTouches[0];

      const inHorizontalBorders = clientX >= left && clientX <= right;
      const inVerticalBorders = clientY >= top && clientY <= bottom;
      const inBorders = inHorizontalBorders && inVerticalBorders;

      if (!inBorders) {
        handleUnhover(event);
      }
    }
  });

  return (
    <div
      ref={wrapperRef}
      className={styles.hoverable}
      onMouseEnter={handleHover}
      onMouseLeave={handleUnhover}
      onTouchStart={handleHover}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleUnhover}
    >
      {children}
    </div>
  );
};
export default deepMemo(Hoverable);
