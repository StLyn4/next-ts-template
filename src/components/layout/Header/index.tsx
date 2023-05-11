import React, { useRef, useState } from 'react';
// import setLanguage from 'next-translate/setLanguage';
import useTranslation from 'next-translate/useTranslation';
import { useWindowEvent } from '@mantine/hooks';
import classNames from 'classnames';
import { useThrottledCallback } from 'use-debounce';

import NavButton from 'app/components/layout/NavButton';
import Logo from 'app/components/ui/Logo';
import Link from 'app/components/utils/Link';
// import { useEvent } from 'app/lib/hooks';
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
  const { t } = useTranslation();
  const [scrollStatus, setScrollStatus] = useState(ScrollStatus.Top);
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

  // const changeLanguage = useEvent((lang: string) => {
  //   document.cookie = `NEXT_LOCALE=${lang}`;
  //   void setLanguage(lang);
  // });

  useWindowEvent('scroll', handleScroll, { passive: true });

  return (
    <header className={classNames(styles.header, { [styles.sticky]: sticky })}>
      <div className={styles.left}>
        <Link href="/">
          <Logo />
        </Link>
        <div className={styles.navigation}>
          <NavButton href="/">
            {t('components:header.components')}
          </NavButton>
          <NavButton href="/second">
            {t('components:header.second-page')}
          </NavButton>
        </div>
      </div>
    </header>
  );
};

export default deepMemo(Header);
