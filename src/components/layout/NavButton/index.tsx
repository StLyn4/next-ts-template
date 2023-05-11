import React from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';

import Link from 'app/components/utils/Link';
import { escapeRegExp, deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export interface NavButtonProps {
  /** Содержимое */
  children: React.ReactNode;

  /** Ссылка, которая будет открыта при нажатии */
  href: string;

  /** Отключена ли навигация по нажатию */
  disabled?: boolean;

  /** Не учитывать ссылки-наследники */
  excludeDescendants?: boolean;
}

/** Кнопка навигации */
const NavButton: React.FC<NavButtonProps> = ({ children, href, disabled = false, excludeDescendants = false }) => {
  const router = useRouter();

  const linkPattern = new RegExp('^' + escapeRegExp(href) + (excludeDescendants ? '/?$' : '(/(.*))?$'));
  const active = linkPattern.test(decodeURI(router.pathname));

  return (
    <Link href={href} disabled={disabled}>
      <div className={classNames(styles.navButton, { [styles.active]: active })}>
        <span>{children}</span>
      </div>
    </Link>
  );
};

export default deepMemo(NavButton);
