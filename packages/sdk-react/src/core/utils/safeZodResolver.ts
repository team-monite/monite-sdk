import { zodResolver } from '@hookform/resolvers/zod';
import type { FieldValues, Resolver } from 'react-hook-form';
import type { z } from 'zod';

type SafeSchema = z.ZodObject<z.ZodRawShape>;

/**
 * Type-safe wrapper around zodResolver that handles schemas with any input type.
 * This allows using schemas where the input type might not extend FieldValues.
 * 
 * We use z.ZodObject<z.ZodRawShape> which is the base type for all Zod objects.
 * This is necessary because zodResolver expects the schema's input type to extend 
 * FieldValues, but our schemas may have different input types. This is safe because:
 * 1. The runtime behavior is identical
 * 2. The resolver's output type is explicitly specified via TFieldValues
 * 3. React Hook Form will validate the actual form data against the schema
 */
export function safeZodResolver<TFieldValues extends FieldValues>(
  schema: unknown
): Resolver<TFieldValues> {
  const resolver = zodResolver(schema as SafeSchema);

  return resolver as unknown as Resolver<TFieldValues>;
}