import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { useWindowEvent, useDisclosure } from '@mantine/hooks';
import { useThrottledCallback } from 'use-debounce';

import Link from 'app/components/utils/Link';
import Button from 'app/components/ui/Button';
import Logo from 'app/components/ui/Logo';
import VectorButton from 'app/components/ui/VectorButton';

import { useBreakpoint } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export interface HeaderProps {
  /** Прилипает ли оглавление к верху окна при прокрутке */
  sticky?: boolean;
}

const enum ScrollStatus {
  /** Мы в самом начале странице */
  Top,

  /** Страница прокручивается вверх */
  Up,

  /** Страница прокручивается вниз */
  Down,
}

/** Оглавление сайта */
const Header: React.FC<HeaderProps> = ({ sticky }) => {
  const breakpoint = useBreakpoint();
  const [scrollStatus, setScrollStatus] = useState(ScrollStatus.Top);
  const [showNavBar, { toggle: toggleNavBar }] = useDisclosure(false);
  const lastScrollPosition = useRef(0);

  const handleScroll = useThrottledCallback(() => {
    const currentScrollPosition = window.scrollY;

    if (currentScrollPosition <= 100 && scrollStatus !== ScrollStatus.Top) {
      setScrollStatus(ScrollStatus.Top);
    }

    if (currentScrollPosition > lastScrollPosition.current && scrollStatus !== ScrollStatus.Down) {
      setScrollStatus(ScrollStatus.Down);
    }

    if (currentScrollPosition < lastScrollPosition.current && scrollStatus === ScrollStatus.Down) {
      setScrollStatus(ScrollStatus.Up);
    }

    lastScrollPosition.current = currentScrollPosition;
  }, 200);

  useWindowEvent('scroll', handleScroll, { passive: true });

  return (
    <header className={classNames(styles.header, { [styles.sticky]: sticky })}>
      <Link href="/" locale="en">
        <Button>EN</Button>
      </Link>
      <Link href="/" locale="ru">
        <Button>RU</Button>
      </Link>
      <Link href="/">
        <Logo />
      </Link>
      {breakpoint === 'desktop' ? (
        <div className={styles.navigationLinks}>
          <span>Раздел 1</span>
          <span>Show nav bar: {showNavBar}</span>
        </div>
      ) : (
        <VectorButton src="common/menu" size={26} onClick={toggleNavBar} />
      )}
    </header>
  );
};

export default deepMemo(Header);
