import React, { useState } from 'react';
import classNames from 'classnames';
import { useThrottledCallback } from 'use-debounce';
import { useWindowEvent } from '@mantine/hooks';

import Clickable from 'app/components/utils/Clickable';
import Vector from 'app/components/ui/Vector';

import { useEvent } from 'app/lib/hooks';
import { clamp, deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export interface ScrollerTopProps {
  /** Прогресс прокрутки **(от 0.0 до 1.0)** страницы после которого кнопка станет видимой */
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

    if (currentScrollPosition >= pageHeight * clampedShowAt && !showScroller) {
      setShowScroller(true);
    }

    if (currentScrollPosition < pageHeight * clampedShowAt && showScroller) {
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
      <div className={classNames(styles.scrollerTop, { [styles.show]: showScroller })}>
        <Vector src="common/arrow-long" color="var(--vector-color)" size={24} />
      </div>
    </Clickable>
  );
};

export default deepMemo(ScrollerTop);
