<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col">
    <!-- Admin Topbar & Sidebar shell -->
    <DashboardLayout>
      <slot />
    </DashboardLayout>
  </div>
</template>

<script setup lang="ts">
import DashboardLayout from '@/core/layouts/DashboardLayout.vue'
</script>
