<script setup lang="ts">
import { computed } from 'vue'
import { useWishlistStore } from '@/stores/wishlist.store'
import { toast } from 'vue-sonner'

const props = withDefaults(
  defineProps<{
    productId: string
    size?: 'sm' | 'md'
  }>(),
  {
    size: 'md'
  }
)

const wishlistStore = useWishlistStore()

const isFavorite = computed(() => {
  return wishlistStore.isWishlisted(props.productId)
})

function handleToggle(e: Event) {
  e.preventDefault()
  e.stopPropagation()
  const added = wishlistStore.toggle(props.productId)
  if (added) {
    toast.success('Produk ditambahkan ke Wishlist')
  } else {
    toast.info('Produk dihapus dari Wishlist')
  }
}
</script>

<template>
  <button
    type="button"
    :title="isFavorite ? 'Hapus dari Wishlist' : 'Tambah ke Wishlist'"
    :class="[
      'rounded-full transition-all duration-200 flex items-center justify-center',
      size === 'sm' ? 'w-8 h-8' : 'w-9 h-9',
      isFavorite
        ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 shadow-xs'
        : 'bg-white/80 dark:bg-gray-800/80 text-gray-500 dark:text-gray-400 hover:text-rose-600 hover:bg-white dark:hover:bg-gray-800 shadow-xs backdrop-blur-xs'
    ]"
    @click="handleToggle"
  >
    <svg
      :class="[
        size === 'sm' ? 'w-4 h-4' : 'w-5 h-5',
        'transition-transform active:scale-125 duration-150',
        isFavorite ? 'fill-current' : 'fill-none stroke-current'
      ]"
      viewBox="0 0 24 24"
      stroke-width="2"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  </button>
</template>
