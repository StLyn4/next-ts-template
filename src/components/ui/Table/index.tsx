import React, { useMemo, isValidElement } from 'react';
import { AnimatePresence, m } from 'framer-motion';

import LoadingIndicator from 'app/components/ui/LoadingIndicator';
import { useI18nDateUtils } from 'app/lib/hooks';
import { asIs, deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export type TitleRenderer = () => React.ReactNode;

export type CellRenderer<Row extends object, Key extends keyof Row> = (
  cell: Row[Key],
  row: Row,
) => unknown;

export type EmptyCellRenderer<Row extends object> = (
  cell: null,
  row: Row,
) => unknown;

interface ColumnBase {
  /** Скрыта ли колонка */
  hidden?: boolean;

  /** Оглавление колонки */
  title?: string | TitleRenderer;

  /** По какой стороне выравнивать оглавление колонки (по умолчанию равно `align`) */
  titleAlign?: 'left' | 'center' | 'right' | 'stretch';

  /** По какой стороне выравнивать содержимое колонки */
  align?: 'left' | 'center' | 'right' | 'stretch';

  /** Фиксированная ширина колонки (также значение по умолчанию для пары minWidth / maxWidth) */
  width?: string;

  /** Минимальная ширина колонки (при растягивании таблицы) */
  minWidth?: string;

  /** Максимальная ширина колонки (при растягивании таблицы) */
  maxWidth?: string;
}

interface ColumnRendererWithKey<Row extends object, Key extends keyof Row> {
  /** Ключ с объекта data (если не указан, то `cell = null` во время рендера) */
  key: Key;

  /** Функция для отображения клетки */
  render?: CellRenderer<Row, Key>;
}

interface ColumnRendererWithoutKey<Row extends object> {
  /** Ключ с объекта data (если не указан, то `cell = null` во время рендера) */
  key?: never;

  /** Функция для отображения клетки */
  render?: EmptyCellRenderer<Row>;
}

/** Проверяет имеет ли колонка ключ */
const isColumnWithoutKey = <Row extends object>(column: Column<Row>): column is ColumnRendererWithoutKey<Row> => {
  return !column.key;
};

type ColumnRenderer<Row extends object> = {
  [Key in keyof Row]: ColumnRendererWithKey<Row, Key> | ColumnRendererWithoutKey<Row>;
}[keyof Row];

export type Column<Row extends object> = ColumnBase & ColumnRenderer<Row>;

export interface TableProps<Row extends object> {
  /** Информация о том как отображать колонки в таблице */
  columns: Column<Row>[];

  /** Массив с данными для отображения в таблице */
  data?: Row[];

  /** Находится ли таблица в состоянии загрузки */
  loading?: boolean;
}

/** Компонент для таблиц */
const Table = <Row extends object>(props: TableProps<Row>): React.ReactElement | null => {
  const { columns, data = [], loading = false } = props;

  const { getFullDate } = useI18nDateUtils();
  const showLoader = useMemo(() => loading || data.length === 0, [loading, data.length]);

  const visibleColumns = columns.filter((column) => !column.hidden);
  const widthsOfColumns = visibleColumns.map((column) => {
    const width = column.width ?? '1fr';
    const minWidth = column.minWidth ?? width;
    const maxWidth = column.maxWidth ?? width;

    return minWidth !== maxWidth ? `minmax(${minWidth}, ${maxWidth})` : width;
  });

  const gridTemplateOfColumns = widthsOfColumns.join(' ');
  const alignsOfColumns = visibleColumns.map((column) => column.align ?? 'stretch');
  const titleAlignsOfColumns = visibleColumns.map((column, i) => column.titleAlign ?? alignsOfColumns[i]);
  const fillGridRow = `1 / ${visibleColumns.length + 1}`;

  /** Функция для получения CSS-классов ячейки по её индексу */
  const getHeaderCellClasses = (index: number): string => {
    return styles[`cell-align-${titleAlignsOfColumns[index]}`];
  };

  /** Функция для получения CSS-классов ячейки по её индексу */
  const getCellClasses = (index: number): string => {
    return styles[`cell-align-${alignsOfColumns[index]}`];
  };

  /** Функция для пост-обработки содержимого ячейки */
  const cellPostProcess = <T, >(cell: T): React.ReactNode => {
    if (cell instanceof Date) {
      return getFullDate(cell);
    }

    if (cell == null) {
      return '';
    }

    if (isValidElement(cell)) {
      return cell;
    }

    return String(cell);
  };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={showLoader ? 'loader' : 'data'}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ ease: 'easeInOut', duration: 0.35 }}
        className={styles.tableWrapper}
      >
        <table
          className={styles.table}
          style={{ gridTemplateColumns: gridTemplateOfColumns }}
        >
          <thead>
            <tr>
              {visibleColumns.map((column, i) => (
                <th key={i} className={getHeaderCellClasses(i)}>
                  {typeof column.title === 'function' ? column.title() : column.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {showLoader ? (
              <tr>
                <td className={styles.cellAlignCenter} style={{ gridColumn: fillGridRow }}>
                  <LoadingIndicator type="dots" size={42} />
                </td>
              </tr>
            ) : (
              data.map((row, i) => {
                return (
                  <tr key={i}>
                    {visibleColumns.map((column, i) => {
                      let renderedCell: unknown = null;

                      if (isColumnWithoutKey(column)) {
                        const render = column.render ?? asIs;
                        renderedCell = render(null, row);
                      } else {
                        const render = column.render ?? asIs;
                        const cell = row[column.key];
                        renderedCell = render(cell, row);
                      }

                      return (
                        <td key={i} className={getCellClasses(i)}>
                          {cellPostProcess(renderedCell)}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </m.div>
    </AnimatePresence>
  );
};

export default deepMemo(Table);
