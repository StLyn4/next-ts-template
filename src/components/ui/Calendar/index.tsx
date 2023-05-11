import React from 'react';
import dynamic from 'next/dynamic';
import useTranslation from 'next-translate/useTranslation';
import classNames from 'classnames';

import { useOptionallyControlledState } from 'app/lib/hooks';
import { deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';
import 'react-calendar/dist/Calendar.css';

// Intl может выдавать разные результаты на сервере и клиенте (спасибо, Safari)
const CalendarComponent = dynamic(() => import('react-calendar'), { ssr: false });

export type DateValue = string | Date | null;
export type DateRange = [DateValue, DateValue];
export type CalendarValue = DateValue | DateRange;

export interface CalendarProps {
  /** Дополнительная стилизация содержимого */
  className?: string;
}

/** Календарь */
const Calendar: React.FC<CalendarProps> = ({ className }) => {
  const { lang } = useTranslation();
  const [value, onChange] = useOptionallyControlledState<CalendarValue>(undefined, new Date());

  return (
    <CalendarComponent
      className={classNames(styles.calendar, className)}
      value={value}
      onChange={onChange}
      locale={lang}
      minDate={new Date()}
      maxDate={new Date(Date.now() + 1_000_000_000)}
      allowPartialRange
      selectRange
      // tileClassName={({ activeStartDate, date, view }) => ''}
      // tileContent={({ activeStartDate, date, view }) => '-'}
      // tileDisabled={({ activeStartDate, date, view }) => false}
    />
  );
};

export default deepMemo(Calendar);
