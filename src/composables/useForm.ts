import { useForm as useVeeForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { z } from 'zod'

export interface UseAppFormOptions<TSchema extends z.ZodTypeAny> {
  schema: TSchema
  initialValues?: Record<string, any>
}

/**
 * Standard Form composable untuk Cepat UI Olshop
 * Menggabungkan VeeValidate dengan schema Zod TypeScript-first
 */
export function useAppForm<TSchema extends z.ZodTypeAny>(options: UseAppFormOptions<TSchema>) {
  const form = useVeeForm<any>({
    validationSchema: toTypedSchema(options.schema),
    initialValues: options.initialValues,
  })

  return {
    ...form,
    schema: options.schema,
  }
}
