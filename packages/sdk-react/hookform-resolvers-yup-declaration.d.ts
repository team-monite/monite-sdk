/**
 * Workaround for the missing types in the `@hookform/resolvers/yup` package
 * with tsconfig `module` set to `ES2022` and `moduleResolution` set to `Bundler`.
 * The module exports the corresponding resolver, but the types are not exported.
 */
declare module '@hookform/resolvers/yup' {
  import {
    FieldValues,
    ResolverOptions,
    ResolverResult,
  } from 'react-hook-form';
  import * as Yup from 'yup';
  import type Lazy from 'yup/lib/Lazy';

  type Options<T extends Yup.AnyObjectSchema | Lazy<any>> = Parameters<
    T['validate']
  >[1];
  export type Resolver = <T extends Yup.AnyObjectSchema | Lazy<any>>(
    schema: T,
    schemaOptions?: Options<T>,
    factoryOptions?: {
      mode?: 'async' | 'sync';
      rawValues?: boolean;
    }
  ) => <TFieldValues extends FieldValues, TContext>(
    values: TFieldValues,
    context: TContext | undefined,
    options: ResolverOptions<TFieldValues>
  ) => Promise<ResolverResult<TFieldValues>>;

  export const yupResolver: Resolver;
}
