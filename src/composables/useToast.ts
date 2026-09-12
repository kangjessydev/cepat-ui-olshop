import { useToastStore } from '@/core/stores/toast.store'

export function useToast() {
  const store = useToastStore()

  return {
    success: (message: string, title?: string) => store.success(message, title),
    error: (message: string, title?: string) => store.error(message, title),
    warning: (message: string, title?: string) => store.warning(message, title),
    info: (message: string, title?: string) => store.info(message, title),
    remove: (id: string) => store.remove(id),
  }
}
