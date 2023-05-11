import type React from 'react';
import { useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';

import { useEvent, useRouterEvent } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';

export interface PageTransitionProps {
  /** Содержимое */
  children: React.ReactNode;

  /** Ссылка на элемент, в который будет происходить рендер, сам элемент, либо CSS-селектор */
  target: React.MutableRefObject<Element | null> | Element | string | null;
}

/** Компонент для отображения содержимое в произвольном DOM-элементе */
const Portal: React.FC<PageTransitionProps> = ({ children, target }) => {
  const [selectedTarget, setSelectedTarget] = useState<Element | null>(null);

  const targetElement = useMemo(() => {
    let targetElement: Element | null = null;

    if (typeof target === 'string') {
      targetElement = selectedTarget;
    } else if (target instanceof Element) {
      targetElement = target;
    } else if (target) {
      targetElement = target.current;
    }

    return targetElement;
  }, [selectedTarget, target]);

  const handleSelectTarget = useEvent(() => {
    if (typeof target === 'string') {
      const selectedTarget = document.querySelector(target);
      setSelectedTarget(selectedTarget);
    }
  });

  useEffect(handleSelectTarget, [handleSelectTarget, target]);
  useRouterEvent('routeChangeComplete', handleSelectTarget);

  return (
    targetElement ? createPortal(children, targetElement) : null
  );
};

export default deepMemo(Portal);
