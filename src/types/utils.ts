// Тип any здесь используется лишь для создания абстрактных Generic* типов.
// Т.е., тот же GenericFunction - любая функция, где невозможно узнать тип более точно.
// Используются они лишь как *промежуточные* - с необходимостью дальнейшего уточнения
/* eslint-disable @typescript-eslint/no-explicit-any*/

import React from 'react';

/** Любой компонент React */
export type GenericComponent = React.ComponentType<any>;

/** Любая функция, которую можно вызвать (в отличии от {@link Function}) */
export type GenericFunction = (...args: any[]) => any;

/**
 * Функция-клон, которая получает все аргументы как "rest"
 * (вместо `fn(a, b, c)` использует интерфейс `fn(...args)`)
 */
export type RestedFunction<Func extends GenericFunction> = (...args: Parameters<Func>) => ReturnType<Func>;
