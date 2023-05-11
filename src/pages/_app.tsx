import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { type NextComponentType } from 'next';
import { type AppContext, type AppProps } from 'next/app';
import Head from 'next/head';
import useTranslation from 'next-translate/useTranslation';
import { MotionConfig, LazyMotion, domAnimation } from 'framer-motion';

import Overlay from 'app/components/ui/Overlay';
import PageTransition from 'app/components/utils/PageTransition';
import StyleSynchronizer from 'app/components/utils/StyleSynchronizer';
import { styleVariables } from 'app/lib/constants';
import store from 'app/redux/store';
import { type Page } from 'app/types';

// Сброс стандартных стилей, подключение глобальных стилей
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
          duration: styleVariables.TRANSITION_DURATION / 1000,
          ease: styleVariables.TRANSITION_TIMING_FUNCTION_ARGS,
        }}
      >
        <LazyMotion features={domAnimation} strict>
          <PageTransition layout={Component.layout}>
            <Head>
              <title>{t('common:general-title')}</title>
              <meta name="description" content={t('common:general-description')} />
              <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0" />
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
