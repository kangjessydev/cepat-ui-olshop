<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="icon-btn relative"
      title="Notifikasi Toko"
    >
      <Bell :size="18" />
      <span
        v-if="notificationStore.unreadCount > 0"
        class="absolute 0 top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"
      />
    </button>

    <!-- Dropdown Menu -->
    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl z-50 overflow-hidden"
      >
        <div class="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">Notifikasi Toko</span>
            <span
              v-if="notificationStore.unreadCount > 0"
              class="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold"
            >
              {{ notificationStore.unreadCount }} Baru
            </span>
          </div>
          <button
            v-if="notificationStore.unreadCount > 0"
            @click="markAllAsRead"
            class="text-[11px] text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 font-medium"
          >
            Tandai Sudah Dibaca
          </button>
        </div>

        <div class="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
          <div
            v-for="item in notificationStore.notifications"
            :key="item.id"
            @click="handleNotificationClick(item)"
            :class="[
              'p-3.5 flex items-start gap-3 transition cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50',
              !item.read ? 'bg-emerald-50/40 dark:bg-emerald-950/10' : ''
            ]"
          >
            <div
              :class="[
                'w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs',
                item.type === 'order'
                  ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                  : item.type === 'stock'
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              ]"
            >
              <ShoppingCart v-if="item.type === 'order'" :size="16" />
              <AlertTriangle v-else-if="item.type === 'stock'" :size="16" />
              <Info v-else :size="16" />
            </div>

            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-slate-900 dark:text-white leading-tight mb-0.5">
                {{ item.title }}
              </p>
              <p class="text-[11px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                {{ item.message }}
              </p>
              <span class="text-[10px] text-slate-400 mt-1 block">Baru saja</span>
            </div>
          </div>
        </div>

        <div class="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-center">
          <router-link
            to="/admin/orders"
            @click="isOpen = false"
            class="text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:text-emerald-600"
          >
            Lihat Semua Pesanan →
          </router-link>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Bell, ShoppingCart, AlertTriangle, Info } from '@lucide/vue'
import { useNotificationStore } from '@/stores/notification.store'
import { useRouter } from 'vue-router'
import type { AppNotificationItem } from '@/adapters/notification'

const notificationStore = useNotificationStore()
const router = useRouter()
const isOpen = ref(false)

onMounted(() => {
  notificationStore.start()
})

function markAllAsRead() {
  notificationStore.notifications.forEach(n => {
    notificationStore.markAsRead(n.id)
  })
}

function handleNotificationClick(item: AppNotificationItem) {
  notificationStore.markAsRead(item.id)
  isOpen.value = false
  if (item.link) {
    router.push(item.link)
  }
}
</script>

<style scoped>
.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-color);
  background: var(--bg-surface);
  color: var(--text-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
}

.icon-btn:hover {
  background: var(--bg-surface-hover);
  color: var(--text-primary);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.96);
}
</style>
