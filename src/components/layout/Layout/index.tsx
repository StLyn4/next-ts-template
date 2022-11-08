import React from 'react';
import Image from 'next/image';

import Header from 'app/components/layout/Header';
import Footer from 'app/components/layout/Footer';
import ScrollerTop from 'app/components/ui/ScrollerTop';

import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export interface LayoutProps {
  /** Содержимое страницы */
  children: React.ReactNode;

  /** Фоновое изображение страницы */
  backgroundImage?: React.ComponentProps<typeof Image>['src'];
}

/** Базовая разметка страницы */
const Layout: React.FC<LayoutProps> = ({ children, backgroundImage }) => {
  return (
    <div className={styles.layout}>
      <Header sticky />
      <main className={styles.main}>
        {backgroundImage && (
          <div className={styles.background}>
            <Image src={backgroundImage} fill quality={100} alt="" priority />
          </div>
        )}
        <div className={styles.content}>{children}</div>
        <ScrollerTop />
      </main>
      <Footer />
    </div>
  );
};

export default deepMemo(Layout);
