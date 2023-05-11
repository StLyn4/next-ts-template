import type React from 'react';

/** Проверяет инициировано ли событие с помощью клаиатуры */
export const isKeyboardEvent = <Target>(event: React.SyntheticEvent<Target>): event is React.KeyboardEvent<Target> => {
  return 'key' in event;
};

/** Проверяет инициировано ли событие с помощью мышки */
export const isMouseEvent = <Target>(event: React.SyntheticEvent<Target>): event is React.MouseEvent<Target> => {
  return 'screenX' in event;
};

/** Проверяет инициировано ли событие с помощью сенсорного экрана */
export const isTouchEvent = <Target>(event: React.SyntheticEvent<Target>): event is React.TouchEvent<Target> => {
  return 'touches' in event;
};
