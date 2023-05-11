import React, { useState, useRef, useImperativeHandle, useMemo } from 'react';
import { Virtuoso } from 'react-virtuoso';
import useTranslation from 'next-translate/useTranslation';
import { useClickOutside } from '@mantine/hooks';
import { useDebounce } from 'use-debounce';

import Input, { type InputRef } from 'app/components/input/Input';
import { type BaseInputRef, type BaseInputProps, type InputValidatorCallback } from 'app/components/input/types';
import Popover from 'app/components/ui/Popover';
import Clickable from 'app/components/utils/Clickable';
import { useEvent, useInputState } from 'app/lib/hooks';
import { clamp, deepMemo } from 'app/lib/utils';

import styles from './styles.module.scss';

export type SelectRef<T, Option extends SelectOption<T>> = BaseInputRef<Option | null>;

/** Выбираемый объект */
export interface SelectOption<T> {
  /** Значение */
  value: T;

  /** Человекочитаемое описание */
  label?: string;

  /** Ключ i18n для получения человекочитаемого описания */
  labelI18nKey?: string;

  /** Иконка */
  icon?: string;

  /** Строка, которая будет использована для локального поиска (если не указана, то будет сгенерирована) */
  localSearchKey?: string;
}

/** Параметры обновления */
export interface UpdateDataOptions<T, Option extends SelectOption<T>> {
  /** Текст для поиска */
  search: string;

  /** С каким смещением необходимо загрузить и обновить данные */
  offset: number;

  /** Текущие варианты выбора */
  options: Option[];
}

export interface SelectProps<T, Option extends SelectOption<T>> extends BaseInputProps<Option | null> {
  /** Максимальная высота списка */
  maxListHeight?: number;

  /** Максимальная длина текста для поиска */
  maxSearchTextLength?: number;

  /** Использовать локальный поиск, даже если использован `onUpdateData` / `onImmediatelyUpdateData` */
  forceLocalSearch?: boolean;

  /** Варианты выбора */
  options: Option[];

  /** Callback на случай поиска / фильтрации списка. Вызывается с задержкой */
  onUpdateData?: (options: UpdateDataOptions<T, Option>) => void | Promise<void>;

  /** Callback на случай поиска / фильтрации списка. Вызывается без задержки  */
  onImmediatelyUpdateData?: (options: UpdateDataOptions<T, Option>) => void | Promise<void>;
}

/** Выпадающий список */
const Select = <T, Option extends SelectOption<T>>(
  props: SelectProps<T, Option>,
  ref: React.ForwardedRef<SelectRef<T, Option>>,
): React.ReactElement | null => {
  const {
    disabled = false,
    enterKeyHint,
    inputMode,
    autoComplete,
    label,
    placeholder = '',
    value: controlledValue,
    initialValue = null,
    errorMessage = '',
    debounceTimeout = 500,
    validator,
    onChange: onControlledChange,
    onDebouncedChange,
    onFocus,
    onBlur,
    onConfirm,
    maxListHeight = 200,
    maxSearchTextLength = Infinity,
    forceLocalSearch = false,
    options = [],
    onUpdateData,
    onImmediatelyUpdateData,
  } = props;

  const { value, error, handleChange, handleValidate } = useInputState(
    controlledValue,
    initialValue,
    errorMessage,
    debounceTimeout,
    onControlledChange,
    onDebouncedChange,
    validator,
  );

  const { t } = useTranslation();
  const [showList, setShowList] = useState(false);
  const [listHeight, setListHeight] = useState(1);

  const searchInputRef = useRef<InputRef>(null);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText] = useDebounce(searchText, 150);

  const hasError = error.length > 0;
  const hasUpdater = Boolean(onUpdateData || onImmediatelyUpdateData);

  // Если нам передали функцию для обновления данных, то по умолчанию локальный поиск отключён
  const localSearchDisabled = hasUpdater && !forceLocalSearch;

  const isInputValid = useMemo(() => {
    return !hasError;
  }, [hasError]);

  const getOptionLabel = useEvent((option: Option | null): string => {
    if (option) {
      if (option.labelI18nKey) {
        return t(option.labelI18nKey, { value: option.value });
      } else if (option.label) {
        return option.label;
      } else if (option.value) {
        return String(option.value);
      }

      return '';
    }

    return placeholder;
  });

  const filteredOptions = useMemo(() => {
    if (localSearchDisabled || !debouncedSearchText) {
      return options;
    }

    return options.filter((option) => {
      const optionKey = option.localSearchKey ?? (getOptionLabel(option) + String(option.value));
      const optionText = optionKey.toLowerCase();
      const searchText = debouncedSearchText.toLowerCase();
      return optionText.includes(searchText);
    });
  }, [getOptionLabel, localSearchDisabled, options, debouncedSearchText]);

  const handleFocus = useEvent(() => {
    if (!showList) {
      setShowList(true);
      onFocus?.();
    }
  });

  const handleBlur = useEvent(() => {
    if (showList) {
      setShowList(false);
      onBlur?.();
    }
  });

  const handleConfirm = useEvent(() => {
    if (onConfirm && isInputValid) {
      blurField();
      void onConfirm(value);
    }
  });

  const handleSearchChange = useEvent((search: string) => {
    setSearchText(search);
    void onImmediatelyUpdateData?.({
      search,
      offset: 0,
      options,
    });
  });

  const handleDebouncedSearchChange = useEvent((search: string) => {
    void onUpdateData?.({
      search,
      offset: 0,
      options,
    });
  });

  const handleEndReached = useEvent(() => {
    const updater = onUpdateData ?? onImmediatelyUpdateData;
    void updater?.({
      search: searchText,
      offset: options.length,
      options,
    });
  });

  const handleTotalListHeightChanged = useEvent((height: number) => {
    // Если элементов недостаточно для заполнения списка полностью,
    // то необходимо рассчитать а сколько же высоты мы занимаем.
    // При этом список не может быть меньше 1 пикселя

    const clampedHeight = clamp(height, 1, maxListHeight);
    if (listHeight !== clampedHeight) {
      setListHeight(clampedHeight);
    }
  });

  const handleItemClick = useEvent((option: Option | null) => {
    handleChange(option);
    handleBlur();
  });

  const focusField = useEvent(() => {
    const { current: searchInput } = searchInputRef;
    if (searchInput) {
      searchInput.focus();
    }
  });

  const blurField = useEvent(() => {
    const { current: searchInput } = searchInputRef;
    if (searchInput) {
      searchInput.blur();
      handleBlur();
    }
  });

  const hideError = useEvent(() => {
    const { current: searchInput } = searchInputRef;
    if (searchInput) {
      searchInput.blur();
    }
  });

  const scrollIntoView = useEvent(() => {
    const { current: searchInput } = searchInputRef;
    if (searchInput) {
      searchInput.scrollIntoView();
    }
  });

  useImperativeHandle(ref, () => ({
    focus: focusField,
    blur: blurField,
    validate: handleValidate,
    hideError,
    scrollIntoView,
  }), [focusField, blurField, handleValidate, hideError, scrollIntoView]);

  const selectRef = useClickOutside(handleBlur);

  return (
    <div ref={selectRef} className={styles.select}>
      <Popover
        content={(
          <div className={styles.list}>
            <Virtuoso
              data={filteredOptions}
              style={{ height: listHeight }}
              overscan={300}
              endReached={handleEndReached}
              totalListHeightChanged={handleTotalListHeightChanged}
              itemContent={(i, option) => (
                <Clickable key={i} onClick={() => handleItemClick(option)}>
                  <div className={styles.item}>
                    {getOptionLabel(option)}
                  </div>
                </Clickable>
              )}
            />
          </div>
        )}
        open={showList && !disabled}
        disableInteractions
        disableFocusManager
        hideArrow
        sameWidth
      >
        <Input
          ref={searchInputRef}
          disabled={disabled}
          enterKeyHint={enterKeyHint}
          inputMode={inputMode}
          autoComplete={autoComplete}
          label={label}
          value={searchText}
          placeholder={placeholder}
          onChange={handleSearchChange}
          onDebouncedChange={handleDebouncedSearchChange}
          onFocus={handleFocus}
          onConfirm={handleConfirm}
          maxLength={maxSearchTextLength}
          errorMessage={error}
          debounceTimeout={debounceTimeout}
        />
      </Popover>
    </div>
  );
};

export default deepMemo(React.forwardRef(Select));
export type { InputValidatorCallback };
