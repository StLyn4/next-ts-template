import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import I18nContext from 'next-translate/context';
import { AnimatePresence } from 'framer-motion';

import Animate from 'app/components/ui/Animate';

import { usePreservePageStyles } from 'app/lib/hooks';
import { asIs, deepMemo } from 'app/lib/utils';

import { LayoutInfo } from 'app/types';

export interface PageTransitionProps {
  /** Страница */
  children: React.ReactNode;

  /** Layout-обёртка страницы */
  layout?: LayoutInfo;
}

/** Обёртка страниц для плавных переходов */
const PageTransition: React.FC<PageTransitionProps> = ({ children, layout }) => {
  const router = useRouter();
  const preservedI18nContext = useContext(I18nContext);
  const releaseStyles = usePreservePageStyles();

  const layoutKey = layout ? layout.key : 'no-layout';
  const getLayout = layout ? layout.getLayout : asIs;

  return (
    <AnimatePresence mode="wait" onExitComplete={releaseStyles}>
      <Animate key={`${layoutKey}-${router.locale ?? ''}`} animate="opacity">
        {/* Чтобы при exit анимации в контексте сохранилось старое значение, нужно пробросить его */}
        <I18nContext.Provider value={preservedI18nContext}>
          {getLayout(
            <AnimatePresence mode="wait" onExitComplete={releaseStyles}>
              <Animate key={router.pathname} animate="opacity">
                <I18nContext.Provider value={preservedI18nContext}>
                  {children}
                </I18nContext.Provider>
              </Animate>
            </AnimatePresence>,
          )}
        </I18nContext.Provider>
      </Animate>
    </AnimatePresence>
  );
};

export default deepMemo(PageTransition);
