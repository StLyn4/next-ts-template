import React from 'react';
import { NextComponentType } from 'next';
import { AppContext, AppProps } from 'next/app';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { Provider as ReduxProvider } from 'react-redux';
import { MotionConfig, LazyMotion, domAnimation } from 'framer-motion';

import PageTransition from 'app/components/utils/PageTransition';
import StyleSynchronizer from 'app/components/utils/StyleSynchronizer';
import Overlay from 'app/components/ui/Overlay';

import { styleVariables } from 'app/lib/constants';

import store from 'app/redux/store';

import { Page } from 'app/types';

// Сброс стандартных стилей, подключение глобальных стилей
import 'app/styles/reset.css';
import 'app/styles/globals.scss';

type AppPropsWithLayout = AppProps & {
  Component: Page;
};
type AppPage = NextComponentType<AppContext, AppPropsWithLayout, AppPropsWithLayout>;

/** Компонент-обёртка приложения */
const App: AppPage = ({ Component, pageProps }) => {
  const { t } = useTranslation();

  return (
    <ReduxProvider store={store}>
      <StyleSynchronizer />
      <MotionConfig
        reducedMotion="user"
        transition={{
          duration: styleVariables.TRANSITION_TIME / 1000,
          ease: styleVariables.TRANSITION_TIMING_FUNCTION_ARGS,
        }}
      >
        <LazyMotion features={domAnimation} strict>
          <PageTransition layout={Component.layout}>
            <Head>
              <link rel="icon" href="/favicon.ico" />
              <title>{t('common:general-title')}</title>
              <meta name="description" content={t('common:general-description')} />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <Overlay />
            <Component {...pageProps} />
          </PageTransition>
        </LazyMotion>
      </MotionConfig>
    </ReduxProvider>
  );
};

export default App;
