/** ID записи в БД */
export type ApiSchemaId = string | number;

/** Базовые поля, которые есть у каждой записи по умолчанию */
export interface ApiSchemaBase {
  id: ApiSchemaId;
  created_at: string;
  updated_at: string;
  published_at?: string;
}
