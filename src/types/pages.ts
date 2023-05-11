import type React from 'react';
import { type NextPage } from 'next';

/** Обёртка страницы */
export interface LayoutInfo {
  /** Ключ, чтобы разные layout'ы можно было различить */
  key: string;

  /** Функция для получения непосредственно layout */
  getLayout: (page: React.ReactElement) => React.ReactNode;
}

/** Обычная страница Next.js, но с возможностью указать layout для неё */
export type Page<Props = unknown> = NextPage<Props> & {
  layout?: LayoutInfo;
};
