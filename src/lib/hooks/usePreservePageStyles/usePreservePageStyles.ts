import { useDebugValue } from 'react';
import { useRouter } from 'next/router';

import { env } from 'app/lib/constants';
import { useEvent, useConstant, useRouterEvent, useUntrackedState } from 'app/lib/hooks';

export type ReleaseStylesHandler = () => void;

/**
 * При переходе между страницами заставляет стили предыдущей страницы сохраниться
 * @returns Функция, которая освобождает ранее сохранённые стили
 */
const usePreservePageStyles = (): ReleaseStylesHandler => {
  const router = useRouter();
  const preservedStyles = useConstant<Node[]>(() => []);
  const [prevPathname, setPrevPathname] = useUntrackedState(router.pathname);

  const releaseStyles = useEvent(() => {
    // Удаляем сохранённые нами ранее стили после того, как они больше не нужны
    for (const style of preservedStyles) {
      document.head.removeChild(style);
    }

    // Очищаем массив
    preservedStyles.length = 0;
  });

  useRouterEvent('routeChangeStart', (url, { shallow }) => {
    // Стили удаляются только на production сборке и без shallow-флага
    if (env.IS_DEVELOPMENT || shallow) {
      return;
    }

    // Копируем стили страницы перед тем, как Next.js их удалит; очистим сами после анимации перехода
    const styles = document.querySelectorAll('link[rel=stylesheet], style:not([media=x])');
    const stylesCopy = Array.from(styles).map((el) => el.cloneNode(true));

    // Контейнер для вставки копий стилей одним обращением в DOM
    const stylesFragment = document.createDocumentFragment();

    for (const style of stylesCopy) {
      if (style instanceof Element) {
        // Удаляем атрибуты, по которым Next.js понимает, что именно эти стили нужно отключить
        style.removeAttribute('data-n-p');
        style.removeAttribute('data-n-href');

        // Если Next.js успел отключить стиль, включаем его обратно
        if (style.getAttribute('media') === 'x') {
          style.removeAttribute('media');
        }

        // Добавляем элемент в DocumentFragment
        stylesFragment.appendChild(style);
      }
    }

    // Добавляем DocumentFragment в DOM
    document.head.appendChild(stylesFragment);
    preservedStyles.push(...stylesCopy);
  });

  useRouterEvent('routeChangeComplete', () => {
    // Ссылка не изменилась, мы делаем переход "на себя" - стили останутся прежними
    if (prevPathname.value === router.pathname) {
      releaseStyles();
      return;
    }

    setPrevPathname(router.pathname);
  });

  useDebugValue(preservedStyles);
  return releaseStyles;
};

export default usePreservePageStyles;
