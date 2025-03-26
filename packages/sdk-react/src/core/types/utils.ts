type _DeepKeys<T> = T extends object
  ? {
      [K in (string | number) & keyof T]: `${
        | `.${K}`
        | (`${K}` extends `${number}` ? `[${K}]` : never)}${
        | ''
        | _DeepKeys<FixArr<T[K]>>}`;
    }[(string | number) & keyof T]
  : never;

type FixArr<T> = T extends readonly any[]
  ? Omit<T, Exclude<keyof any[], number>>
  : T;

type DropInitDot<T> = T extends `.${infer U}` ? U : T;

export type DeepKeys<T> = DropInitDot<_DeepKeys<FixArr<T>>>;
