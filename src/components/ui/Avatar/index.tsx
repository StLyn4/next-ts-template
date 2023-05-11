import React from 'react';
import Image from 'next/image';
import classNames from 'classnames';

import { MissingArgumentException } from 'app/lib/errors';
import { deepMemo } from 'app/lib/utils';
import { type ImageSource } from 'app/types';

import styles from './styles.module.scss';

export interface AvatarProps {
  /** Кастомное содержимое */
  children?: React.ReactNode;

  /** Путь к аватарке-картинке */
  imageSrc?: ImageSource;

  /** Имя для инициалов */
  name?: string;

  /** Размер аватарки */
  size?: number;
}

/**
 * Аватарка; для отображения содержимого используется один из атрибутов:
 * `children` (JSX-элемент), `imageSrc` (изображение), или же `name` (текст)
 */
const Avatar: React.FC<AvatarProps> = ({ children, imageSrc, name, size = 32 }) => {
  // У нас есть кастомный контент - отображаем его как есть, но с добавлением обрамления
  if (children) {
    return (
      <div
        className={classNames(styles.avatar, styles.noSelection)}
        style={{ width: size, height: size }}
      >
        {children}
      </div>
    );
  }

  // Нам дали путь к картинке - грузим; без `user-selection: none` - иначе слетает `draggable`
  if (imageSrc) {
    return (
      <div className={styles.avatar} style={{ width: size, height: size }}>
        <Image src={imageSrc} fill draggable={false} alt="Avatar" />
      </div>
    );
  }

  // Мы получили имя - отображаем инициалы первого и последнего слова (ФИО)
  if (name) {
    // Делаем первый символ каждого слова заглавным, разделяем по пробелам
    const words = name.trim().toUpperCase().split(' ');

    // Если у нас есть только одно слово - 1 инициал, больше - 2
    const initials = words.length === 1 ? words[0][0] : words[0][0] + words[words.length - 1][0];

    // Если ширина или высота аватарки меньше 64 пикселей, то используем шрифты поменьше
    const isSmallAvatar = size < 64;

    return (
      <div
        className={classNames(styles.avatar, styles.noSelection)}
        style={{ width: size, height: size }}
      >
        <span className={isSmallAvatar ? styles.smallLabel : styles.mediumLabel}>{initials}</span>
      </div>
    );
  }

  throw new MissingArgumentException('Один из атрибутов должен быть указан: children | imageSrc | name');
};

export default deepMemo(Avatar);
