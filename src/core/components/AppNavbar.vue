<template>
  <header class="navbar">
    <!-- Left: Mobile menu + Breadcrumb -->
    <div class="navbar-left">
      <!-- Mobile hamburger -->
      <button class="mobile-menu-btn" @click="uiStore.toggleMobileSidebar()">
        <Menu :size="20" />
      </button>

      <!-- Breadcrumb -->
      <AppBreadcrumb />
    </div>

    <!-- Right: actions -->
    <div class="navbar-right">
      <!-- Storefront link -->
      <router-link
        to="/"
        target="_blank"
        class="storefront-link"
        title="Buka Toko Publik"
      >
        <Store :size="15" />
        <span class="hidden sm:inline">Lihat Toko</span>
        <ExternalLink :size="12" class="opacity-60" />
      </router-link>

      <!-- Dark mode toggle -->
      <button
        v-if="appConfig.features.darkMode"
        class="icon-btn"
        :title="uiStore.isDarkMode ? 'Light mode' : 'Dark mode'"
        @click="uiStore.toggleDarkMode()"
      >
        <Moon v-if="!uiStore.isDarkMode" :size="18" />
        <Sun v-else :size="18" />
      </button>

      <!-- Notifications dropdown -->
      <NotificationDropdown v-if="appConfig.features.notifications" />

      <!-- User avatar dropdown -->
      <div class="user-dropdown" @click="dropdownOpen = !dropdownOpen">
        <div class="navbar-avatar">{{ userInitials }}</div>
        <ChevronDown :size="14" class="dropdown-chevron" :class="{ rotated: dropdownOpen }" />

        <Transition name="dropdown">
          <div v-if="dropdownOpen" class="dropdown-menu card">
            <div class="dropdown-user-info">
              <p class="dropdown-user-name">{{ user?.name }}</p>
              <p class="dropdown-user-email">{{ user?.email }}</p>
            </div>
            <div class="dropdown-divider" />
            <button class="dropdown-item" @click="logout()">
              <LogOut :size="15" />
              Sign out
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ChevronDown, ExternalLink, LogOut, Menu, Moon, Store, Sun } from '@lucide/vue'
import AppBreadcrumb from './AppBreadcrumb.vue'
import NotificationDropdown from '@/components/admin/NotificationDropdown.vue'
import { useUiStore } from '@/core/stores/ui.store'
import { useAuth } from '@/core/composables/useAuth'
import appConfig from '@/app.config'

const uiStore = useUiStore()
const { user, logout } = useAuth()
const dropdownOpen = ref(false)

const userInitials = computed(() => {
  const name = user.value?.name ?? 'G'
  return name.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()
})

// Close dropdown on outside click
onMounted(() => {
  document.addEventListener('click', (e) => {
    const el = document.querySelector('.user-dropdown')
    if (el && !el.contains(e.target as Node)) {
      dropdownOpen.value = false
    }
  })
})
</script>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 1.25rem;
  background: var(--bg-navbar);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 30;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 7px;
  cursor: pointer;
  transition: background 0.15s;
}

.mobile-menu-btn:hover {
  background: var(--border-color);
}

@media (max-width: 1024px) {
  .mobile-menu-btn { display: flex; }
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  border-radius: 7px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.icon-btn:hover {
  background: var(--border-color);
  color: var(--text-primary);
}

/* User dropdown */
.user-dropdown {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: background 0.15s;
  margin-left: 0.25rem;
}

.user-dropdown:hover {
  background: var(--border-color);
}

.navbar-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.6875rem;
}

.dropdown-chevron {
  color: var(--text-muted);
  transition: transform 0.2s ease;
}

.dropdown-chevron.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 220px;
  padding: 0.5rem;
  z-index: 100;
}

.dropdown-user-info {
  padding: 0.5rem 0.625rem;
}

.dropdown-user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.125rem;
}

.dropdown-user-email {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0.375rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.625rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.875rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  text-align: left;
}

.dropdown-item:hover {
  background: #fee2e2;
  color: #b91c1c;
}

.storefront-link {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  border-radius: 8px;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  font-size: 0.8125rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s;
}

.storefront-link:hover {
  background: var(--bg-surface-hover);
  color: var(--color-primary, #10b981);
  border-color: var(--color-primary, #10b981);
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
