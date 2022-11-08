import React from 'react';
import NextLink, { LinkProps as NextLinkProps } from 'next/link';
import classNames from 'classnames';

import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export interface LinkProps extends Omit<NextLinkProps, 'passHref'> {
  /** Содержимое */
  children: React.ReactNode;

  /** Отключена ли ссылка */
  disabled?: boolean;

  /** Открыть ссылку в новой вкладке */
  newTab?: boolean;
}

/** Ссылка для переходов между страницами, как внутри сайта, так и вне его */
const Link: React.FC<LinkProps> = ({ children, href, disabled = false, newTab = false, ...props }) => {
  if (disabled) {
    return (
      <div className={classNames(styles.link, styles.disabled)}>
        {children}
      </div>
    );
  }

  return (
    <div className={styles.link}>
      <NextLink href={href} scroll={false} target={newTab ? '_blank' : '_self'} {...props}>
        {children}
      </NextLink>
    </div>
  );
};

export default deepMemo(Link);
