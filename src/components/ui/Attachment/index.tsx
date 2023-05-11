import React, { useMemo } from 'react';

import Vector from 'app/components/ui/Vector';
import Link from 'app/components/utils/Link';
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
  const fullFileUrl = useMemo(() => new URL(file, env.API_URL).href, [file]);

  return (
    <Link newTab href={fullFileUrl}>
      <span className={styles.attachment}>
        {icon ? <Vector src={icon} color="#0E9285" size={16} /> : null}
        <span className={styles.filename}>{children}</span>
      </span>
    </Link>
  );
};

export default deepMemo(Attachment);
