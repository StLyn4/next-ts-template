import React from 'react';

import Link from 'app/components/utils/Link';
import Logo from 'app/components/ui/Logo';

import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

/** Компонент навигации для мобильных устройств */
const NavigationBar: React.FC = () => {
  return (
    <div className={styles.navigationBar}>
      <Link href="/">
        <Logo />
      </Link>
      <span>Раздел 1</span>
      <span>Раздел 2</span>
      <span>Раздел 3</span>
    </div>
  );
};

export default deepMemo(NavigationBar);
