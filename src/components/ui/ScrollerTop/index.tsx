import React, { useState } from 'react';
import { useWindowEvent } from '@mantine/hooks';
import classNames from 'classnames';
import { useThrottledCallback } from 'use-debounce';

import Vector from 'app/components/ui/Vector';
import Clickable from 'app/components/utils/Clickable';
import { useEvent } from 'app/lib/hooks';
import { clamp, deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export interface ScrollerTopProps {
  /** Прогресс прокрутки страницы **(от 0.0 до 1.0)** после которого кнопка станет видимой */
  showAt?: number;
}

/** Кнопка для прокрутки страницы вверх */
const ScrollerTop: React.FC<ScrollerTopProps> = ({ showAt = 0.4 }) => {
  const [showScroller, setShowScroller] = useState(false);

  const handleScroll = useThrottledCallback(() => {
    const clampedShowAt = clamp(showAt, 0, 1);
    const currentScrollPosition = window.scrollY;

    const pageHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.offsetHeight,
      document.body.clientHeight,
      document.documentElement.clientHeight,
    );

    if (!showScroller && currentScrollPosition >= pageHeight * clampedShowAt) {
      setShowScroller(true);
    }

    if (showScroller && currentScrollPosition < pageHeight * clampedShowAt) {
      setShowScroller(false);
    }
  }, 200);

  const handleClick = useEvent(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  useWindowEvent('scroll', handleScroll, { passive: true });
  useWindowEvent('resize', handleScroll, { passive: true });

  return (
    <Clickable onClick={handleClick}>
      <div className={classNames(styles.scroller, { [styles.show]: showScroller })}>
        <Vector src="common/arrow-long-up" size={24} />
      </div>
    </Clickable>
  );
};

export default deepMemo(ScrollerTop);
