<template>
  <div class="auth-shell">
    <div class="auth-bg">
      <!-- Decorative gradient blobs -->
      <div class="blob blob-1" />
      <div class="blob blob-2" />
    </div>

    <div class="auth-card card">
      <!-- Logo -->
      <div class="auth-logo">
        <router-link to="/" class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
            <ShoppingBag :size="20" />
          </div>
          <div class="flex flex-col items-start">
            <span class="font-bold text-base tracking-tight text-slate-900 dark:text-white">Cepat Olshop</span>
            <span class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Portal Toko Online</span>
          </div>
        </router-link>
      </div>

      <!-- Page content (login/register form, etc.) -->
      <slot />
    </div>

    <p class="auth-footer text-xs text-slate-500 dark:text-slate-400 mt-6">
      &copy; {{ new Date().getFullYear() }} Cepat UI Olshop. All rights reserved.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ShoppingBag } from '@lucide/vue'
</script>

<style scoped>
.auth-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: var(--bg-app);
  position: relative;
  overflow: hidden;
}

.auth-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.12;
}

.blob-1 {
  width: 500px;
  height: 500px;
  background: #10b981;
  top: -100px;
  right: -100px;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: #059669;
  bottom: -80px;
  left: -80px;
}

.auth-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  padding: 2rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  box-shadow: 0 10px 30px -10px rgb(0 0 0 / 0.1);
}

.auth-logo {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}
</style>
