import React from 'react';
import { NextComponentType } from 'next';
import { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';

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
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
