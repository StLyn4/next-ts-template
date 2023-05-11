import React from 'react';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';

import Layout from 'app/components/layout/Layout';
import Button from 'app/components/ui/Button';
import Link from 'app/components/utils/Link';
import { type Page } from 'app/types';

import styles from 'app/styles/pages/second.module.scss';

/** Тестовая страница */
const Second: Page = () => {
  const { t } = useTranslation('second-page');

  return (
    <>
      <Head>
        <title>{t('second-page:title')}</title>
        <meta name="description" content={t('second-page:description')} />
      </Head>
      <div className={styles.centered}>
        <h1 className={styles.title}>{t('second-page:title')}</h1>
        <Link href={{ pathname: '/' }}>
          <Button>{t('second-page:return')}</Button>
        </Link>
      </div>
    </>
  );
};

Second.layout = {
  key: 'general-layout',
  getLayout: (page) => <Layout>{page}</Layout>,
};

export default Second;
