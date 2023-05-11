/** Название контрольной точки окна */
export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Контрольные точки ширины окна */
export type Breakpoints = {
  [Key in BreakpointName]: string;
}

/** Границы контрольной точки */
export interface BreakpointBound {
  /** Минимальная ширина экрана для контрольной точки (`null` - отсутствие лимита) */
  minWidth: number | string | null;

  /** Максимальная ширина экрана для контрольной точки (`null` - отсутствие лимита) */
  maxWidth: number | string | null;
}

/** Границы всех контрольных точек */
export type BreakpointBounds = {
  [Key in BreakpointName]: BreakpointBound;
}
