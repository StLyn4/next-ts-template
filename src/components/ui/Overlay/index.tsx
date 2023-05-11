import React from 'react';

import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

/** TODO: описание */
const Overlay: React.FC = () => {
  return <div className={styles.overlay}>{/* TODO: реализация */}</div>;
};

export default deepMemo(Overlay);
