import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import I18nContext from 'next-translate/context';
import { AnimatePresence, m, type Variants } from 'framer-motion';

import { useEvent, usePreservePageStyles } from 'app/lib/hooks';
import { asIs, deepMemo } from 'app/lib/utils';
import { type LayoutInfo } from 'app/types';

const pageVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

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

  const getLayout = layout ? layout.getLayout : asIs;
  const layoutKey = layout ? layout.key : 'no-layout';
  const localeKey = router.locale ?? 'default';

  const handleScrollToTop = useEvent(() => {
    window.scrollTo(0, 0);
  });

  return (
    <AnimatePresence mode="wait" onExitComplete={releaseStyles}>
      <m.div
        key={`${layoutKey}-${localeKey}`}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={pageVariants}
      >
        {/* Чтобы при exit анимации в контексте сохранилось старое значение, нужно пробросить его */}
        <I18nContext.Provider value={preservedI18nContext}>
          {getLayout(
            <AnimatePresence mode="wait" onExitComplete={releaseStyles}>
              <m.div
                key={router.pathname}
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={pageVariants}
                onAnimationStart={handleScrollToTop}
              >
                <I18nContext.Provider value={preservedI18nContext}>
                  {children}
                </I18nContext.Provider>
              </m.div>
            </AnimatePresence>,
          )}
        </I18nContext.Provider>
      </m.div>
    </AnimatePresence>
  );
};

export default deepMemo(PageTransition);
