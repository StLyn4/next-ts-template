import React, { useState, useRef, useId, useEffect, useMemo } from 'react';
import InlineSvg, { type Props as InlineSvgProps } from 'react-inlinesvg';
import classNames from 'classnames';

import { useEvent } from 'app/lib/hooks';
import { escapeRegExp, isUrlValid, deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

// ----------------- Константы-настройки -----------------
const DEFAULT_VECTOR_FOLDER = '/assets/images/vector';
const COLOR_ATTRIBUTES = ['color', 'fill', 'stroke', 'stop-color'] as const satisfies readonly string[];
const REPLACEABLE_COLORS = ['black', '#000000', '#000', '#replace'] as const satisfies readonly string[];
// -------------------------------------------------------

const colorAttributes = COLOR_ATTRIBUTES.map(escapeRegExp).join('|');
const replaceColors = REPLACEABLE_COLORS.map(escapeRegExp).join('|');

// Шаблон для поиска цвета под замену в аттрибутах и стилях
const replaceColorsAttrRegExp = new RegExp(`(${colorAttributes})="(${replaceColors})"`, 'g');
const replaceColorsCSSRegExp = new RegExp(`(${colorAttributes}): (${replaceColors})`, 'g');

export type VectorSize = '100%' | number;

export interface VectorProps {
  /** Название векторного изображения с папки `assets/images/vector`, или же полный путь (URL) */
  src: string;

  /** Дополнительные CSS-классы для SVG-элемента */
  className?: string;

  /** Дополнительные CSS-классы для обёртки SVG-элемента */
  containerClassName?: string;

  /**
   * Цвет изображения (заменяет собой цвета {@link REPLACEABLE_COLORS} в SVG)
   *
   * @remarks
   * Можно использовать любые CSS-свойства цвета, в том числе переменные: `color="var(--my-color)"`
   */
  color?: string;

  /** Размер SVG */
  size?: VectorSize;

  /** Иконка, которая будет отображаться при ошибке */
  fallback?: string;
}

/**
 * Замена цветов-шаблонов ({@link REPLACEABLE_COLORS}) на CSS-переменную
 *
 * @param svg - Содержимое SVG
 * @returns Измененный SVG
 */
const colorPreProcessor = (svg: string): string => {
  // Содержимое после замены цветов в аттрибутах
  const precessedAttrs = svg.replace(replaceColorsAttrRegExp, (match: string, attr: string) => {
    return `${attr}="currentColor"`;
  });

  // Содержимое после замены цветов в стилях
  return precessedAttrs.replace(replaceColorsCSSRegExp, (match: string, attr: string) => {
    return `${attr}: currentColor`;
  });
};

/**
 * Векторное изображение
 *
 * @remarks
 * Для добавления новых изображений поместите их в папку `assets/images/vector`
 */
const Vector: React.FC<VectorProps> = ({
  src,
  className = '',
  color = 'currentColor',
  size = '100%',
  fallback = 'common/warning',
}) => {
  const [initialClassName, setInitialClassName] = useState('');
  const [loaded, setLoaded] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const vectorId = useId();

  const svgSrc = useMemo(() => isUrlValid(src) ? src : `${DEFAULT_VECTOR_FOLDER}/${src}.svg`, [src]);
  const styleSafeVectorId = useMemo(() => vectorId.replace(/:/g, '-'), [vectorId]);

  const wrapperStyle: React.CSSProperties = {
    color, // провайдер для цвета изображения
    width: size, // при загрузке компонент занимает 0x0 px,
    height: size, // поэтому указываем размер явно
    minWidth: size,
    minHeight: size,
  };

  const extraSvgProps: Partial<InlineSvgProps> = {};
  if (className && loaded) {
    extraSvgProps.className = classNames(initialClassName, className);
  }

  const handleLoaded = useEvent(() => {
    const { current: svg } = svgRef;

    if (!loaded && svg !== null) {
      setInitialClassName(svg.getAttribute('class') || '');
      setLoaded(true);
    }
  });

  useEffect(() => {
    setInitialClassName('');
    setLoaded(false);
  }, [src]);

  return (
    <span className={styles.vector} style={wrapperStyle}>
      <InlineSvg
        innerRef={svgRef}
        onLoad={handleLoaded}
        src={svgSrc}
        preProcessor={colorPreProcessor}
        width="100%"
        height="100%"
        cacheRequests
        uniquifyIDs
        uniqueHash={styleSafeVectorId}
        {...extraSvgProps}
      >
        <Vector src={fallback} color="var(--warning-color)" size={size} />
      </InlineSvg>
    </span>
  );
};

export default deepMemo(Vector);
