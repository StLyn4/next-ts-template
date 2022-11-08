import React from 'react';

import Link from 'app/components/utils/Link';
import Vector from 'app/components/ui/Vector';

import { env } from 'app/lib/constants';
import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export interface AttachmentProps {
  /** Название файла */
  children: React.ReactNode;

  /** Ссылка на файл */
  file: string;

  /** Иконка */
  icon?: string;
}

/** Прикреплённый файл */
const Attachment: React.FC<AttachmentProps> = ({ children, file, icon }) => {
  const fullFileUrl = new URL(file, env.API_URL).href;

  return (
    <Link newTab href={fullFileUrl}>
      <span className={styles.attachment}>
        {typeof icon !== 'undefined' && <Vector src={icon} color="#0E9285" size={16} />}
        <span className={styles.filename}>{children}</span>
      </span>
    </Link>
  );
};
export default deepMemo(Attachment);
