import React from 'react';
import { type IControl } from 'react-map-gl';
import { type ControlPosition, useControl } from 'react-map-gl/maplibre';

import Portal from 'app/components/utils/Portal';
import { useForceUpdate } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';

/** Контроллер-пустышка Mapbox */
class OverlayControl implements IControl {
  private container: HTMLElement | null = null;
  private redraw: () => void;

  /**
   * Контроллер-пустышка Mapbox
   * @param redraw - функция для принудительной перерисовки связанного React-компонента
   */
  constructor(redraw: () => void) {
    this.redraw = redraw;
  }

  /** Callback, который вызывается, когда контроллер добавляется на карту */
  onAdd = (): HTMLElement => {
    this.container = document.createElement('div');
    this.redraw();
    return this.container;
  };

  /** Callback, который вызывается, когда контроллер удаляется с карты */
  onRemove = (): void => {
    this.container?.remove();
  };

  /** Получение DOM-элемента, отведённого под отрисовку контроллера */
  getElement = (): HTMLElement | null => {
    return this.container;
  };
}

export interface ReactOverlayControlProps {
  /** Содержимое элемента управления */
  children: React.ReactNode;

  /** Расположение элемента управления относительно карты */
  position?: ControlPosition;
}

/** Прослойка для отображения React-компонентов в качестве элементов управления карты */
const ReactOverlayControl: React.FC<ReactOverlayControlProps> = ({ children, position }) => {
  const forceUpdate = useForceUpdate();

  const control = useControl(
    () => new OverlayControl(forceUpdate),
    { position },
  );

  const target = control.getElement();

  return (
    <Portal target={target}>
      {children}
    </Portal>
  );
};

export default deepMemo(ReactOverlayControl);
