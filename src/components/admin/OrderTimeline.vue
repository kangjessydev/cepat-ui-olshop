<script setup lang="ts">
import type { OrderTimelineEvent } from '@/types'

const props = defineProps<{
  events: OrderTimelineEvent[]
}>()

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr)
    return d.toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateStr
  }
}

function getActorBadge(actor?: string) {
  switch (actor) {
    case 'customer':
      return { label: 'Pelanggan', class: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' }
    case 'admin':
      return { label: 'Admin', class: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' }
    case 'system':
    default:
      return { label: 'Sistem', class: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' }
  }
}
</script>

<template>
  <div class="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-700">
    <div
      v-for="(event, idx) in events"
      :key="event.id || idx"
      class="relative group"
    >
      <!-- Timeline Node Dot -->
      <div class="absolute -left-[21px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white dark:border-gray-900 bg-emerald-500 ring-2 ring-emerald-500/20 group-hover:scale-125 transition-transform"></div>

      <!-- Event Card -->
      <div class="bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-lg border border-gray-100 dark:border-gray-800">
        <div class="flex items-center justify-between gap-2 flex-wrap mb-1">
          <span class="font-medium text-sm text-gray-900 dark:text-gray-100">
            {{ event.title }}
          </span>
          <div class="flex items-center gap-2">
            <span
              v-if="event.actor"
              :class="['text-[11px] font-medium px-2 py-0.5 rounded-full', getActorBadge(event.actor).class]"
            >
              {{ getActorBadge(event.actor).label }}
            </span>
            <span class="text-xs text-gray-400 dark:text-gray-500">
              {{ formatDate(event.timestamp) }}
            </span>
          </div>
        </div>
        <p v-if="event.description" class="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          {{ event.description }}
        </p>
      </div>
    </div>
  </div>
</template>
