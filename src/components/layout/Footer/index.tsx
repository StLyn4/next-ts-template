import React from 'react';
import useTranslation from 'next-translate/useTranslation';

import { deepMemo } from 'app/lib/utils';
import pkg from 'root/package.json';

import styles from './styles.module.scss';

/** Подвал сайта */
const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        {t('components:footer.copyright', { year: new Date().getFullYear(), version: pkg.version })}
      </p>
    </footer>
  );
};

export default deepMemo(Footer);
