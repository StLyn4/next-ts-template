import React from 'react';
import { type NextComponentType } from 'next';
import { Html, Head, Main, NextScript, type DocumentContext, type DocumentInitialProps } from 'next/document';

type DocumentPage = NextComponentType<DocumentContext, DocumentInitialProps, DocumentInitialProps>;

/**
 * Компонент-обёртка приложения
 *
 * @remarks
 * Рендер происходит только на сервере, в отличие от `App`.
 * `App` является, по сути, лишь частью `Document`.
 * Также, внешние шрифты нужно подключать именно здесь
 */
const Document: DocumentPage = () => {
  return (
    <Html data-theme="light">
      <Head>
        <meta charSet="utf-8" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
