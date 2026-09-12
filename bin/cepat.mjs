#!/usr/bin/env node

/**
 * Cepat UI CLI — Developer Experience & Scaffolding Tooling
 *
 * Scaffolds admin resources, storefront pages, stores, mock seeds,
 * and configures multi-category adapters (Shipping, Storage, Notification, Auth).
 *
 * Usage:
 *   npx cepat make:admin-resource <Name> [options]
 *   npx cepat make:storefront-page <Name> [options]
 *   npx cepat make:store <Name>
 *   npx cepat make:mock-data <Name>
 *   npx cepat seed:reset
 *   npx cepat make:adapter <category> <Name>
 *   npx cepat use:adapter <category> <type>
 *   npx cepat addon:<name>
 *   npx cepat list:routes
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT = path.resolve(__dirname, '..')

// --- ANSI Colors ---
const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
}

const banner = `
${c.cyan}${c.bold}   ___ ___ ___  _ _____   _   _ ___ 
  / __| __| _ \\/_\\_   _| | | | |_ _|
 | (__| _||  _/ _ \\| |   | |_| || | 
  \\___|___|_|/_/ \\_\\_|    \\___/|___|${c.reset}
  ${c.dim}Cepat UI Olshop DX Generator & Tooling v1.0.0${c.reset}
`

// --- Argument parser ---
function parseArgs(args) {
  const parsed = { _: [], options: {} }
  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, ...valParts] = arg.slice(2).split('=')
      const value = valParts.length > 0 ? valParts.join('=') : true
      parsed.options[key] = value
    } else {
      parsed._.push(arg)
    }
  }
  return parsed
}

// --- String helpers ---
function toPascalCase(str) {
  return str
    .replace(/[-_ ]+(\w)/g, (_, ch) => ch.toUpperCase())
    .replace(/^\w/, ch => ch.toUpperCase())
}

function toCamelCase(str) {
  const p = toPascalCase(str)
  return p.charAt(0).toLowerCase() + p.slice(1)
}

function toKebabCase(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

function toTitleCase(str) {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, ch => ch.toUpperCase())
}

// --- File helpers ---
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

// =========================================================================
// ROUTE & NAVIGATION REGISTRARS
// =========================================================================

function registerAdminNavigation({ title, icon = 'Package', route, roles }) {
  const navFile = path.join(ROOT, 'src/core/router/navigation.ts')
  if (!fs.existsSync(navFile)) return false

  let content = fs.readFileSync(navFile, 'utf-8')
  if (content.includes(`route: '${route}'`)) {
    console.log(`  ${c.yellow}⚠ Navigation route '${route}' already exists in navigation.ts${c.reset}`)
    return false
  }

  const roleEntry = roles && roles.length > 0 ? `,\n    roles: [${roles.map(r => `'${r}'`).join(', ')}]` : ''
  const newNavItem = `  {
    title: '${title}',
    icon: '${icon}',
    route: '${route}'${roleEntry},
  },
`

  const lastBracket = content.lastIndexOf(']')
  if (lastBracket !== -1) {
    content = content.slice(0, lastBracket) + newNavItem + content.slice(lastBracket)
    fs.writeFileSync(navFile, content, 'utf-8')
    console.log(`  ${c.green}✓ Added menu item '${title}' to ${c.bold}src/core/router/navigation.ts${c.reset}`)
    return true
  }
  return false
}

function registerAdminRoutes({ kebabName, pascalName, title }) {
  const file = path.join(ROOT, 'src/router/admin.routes.ts')
  if (!fs.existsSync(file)) return false

  let content = fs.readFileSync(file, 'utf-8')
  if (content.includes(`path: '/admin/${kebabName}'`)) {
    console.log(`  ${c.yellow}⚠ Admin route '/admin/${kebabName}' already exists in admin.routes.ts${c.reset}`)
    return false
  }

  const newRoutes = `  {
    path: '/admin/${kebabName}',
    name: 'admin-${kebabName}',
    component: () => import('@/views/admin/${pascalName}ListView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: '${title}', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/${kebabName}/create',
    name: 'admin-${kebabName}-create',
    component: () => import('@/views/admin/${pascalName}FormView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Tambah ${title}', roles: ['admin', 'super_admin'] }
  },
  {
    path: '/admin/${kebabName}/:id/edit',
    name: 'admin-${kebabName}-edit',
    component: () => import('@/views/admin/${pascalName}FormView.vue'),
    meta: { layout: 'dashboard', requiresAuth: true, title: 'Edit ${title}', roles: ['admin', 'super_admin'] }
  },
`

  const lastBracket = content.lastIndexOf(']')
  if (lastBracket !== -1) {
    content = content.slice(0, lastBracket) + newRoutes + content.slice(lastBracket)
    fs.writeFileSync(file, content, 'utf-8')
    console.log(`  ${c.green}✓ Registered 3 routes in ${c.bold}src/router/admin.routes.ts${c.reset}`)
    return true
  }
  return false
}

function registerStorefrontRoute({ kebabName, pascalName, title, routePath }) {
  const file = path.join(ROOT, 'src/router/storefront.routes.ts')
  if (!fs.existsSync(file)) return false

  let content = fs.readFileSync(file, 'utf-8')
  if (content.includes(`path: '${routePath}'`)) {
    console.log(`  ${c.yellow}⚠ Storefront route '${routePath}' already exists in storefront.routes.ts${c.reset}`)
    return false
  }

  const newRoute = `  {
    path: '${routePath}',
    name: '${kebabName}',
    component: () => import('@/views/storefront/${pascalName}View.vue'),
    meta: { layout: 'storefront', title: '${title}' }
  },
`

  const lastBracket = content.lastIndexOf(']')
  if (lastBracket !== -1) {
    content = content.slice(0, lastBracket) + newRoute + content.slice(lastBracket)
    fs.writeFileSync(file, content, 'utf-8')
    console.log(`  ${c.green}✓ Registered route in ${c.bold}src/router/storefront.routes.ts${c.reset}`)
    return true
  }
  return false
}

// =========================================================================
// COMMAND HANDLERS
// =========================================================================

/**
 * make:admin-resource <Name>
 * Scaffolds an Admin ListView and FormView, registers admin routes and sidebar navigation.
 */
function makeAdminResource(name, options) {
  if (!name) {
    console.error(`${c.red}Error: Resource name is required.${c.reset} Example: npx cepat make:admin-resource Brand`)
    process.exit(1)
  }

  const kebab = toKebabCase(name)
  const pascal = toPascalCase(name)
  const title = options.title || toTitleCase(name)
  const icon = options.icon || 'Package'
  const roles = options.roles ? options.roles.split(',').map(r => r.trim()) : ['admin', 'super_admin']
  const force = !!options.force

  const listFilePath = path.join(ROOT, `src/views/admin/${pascal}ListView.vue`)
  const formFilePath = path.join(ROOT, `src/views/admin/${pascal}FormView.vue`)

  if (fs.existsSync(listFilePath) && !force) {
    console.error(`${c.red}Error: File ${listFilePath} already exists.${c.reset} Use --force to overwrite.`)
    process.exit(1)
  }

  // Generate ListView
  const listTemplate = `<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Manajemen ${title}
        </h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Kelola data ${title.toLowerCase()} dan konfigurasi untuk toko Anda.
        </p>
      </div>
      <div class="flex items-center gap-3">
        <BaseButton variant="outline" size="sm" @click="handleExport">
          <Download class="w-4 h-4 mr-2" />
          Ekspor CSV
        </BaseButton>
        <router-link to="/admin/${kebab}/create">
          <BaseButton variant="primary" size="sm">
            <Plus class="w-4 h-4 mr-2" />
            Tambah ${title}
          </BaseButton>
        </router-link>
      </div>
    </div>

    <!-- Filter & Search Bar -->
    <BaseCard>
      <div class="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div class="relative w-full sm:w-80">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari ${title.toLowerCase()}..."
            class="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div class="text-sm text-slate-500 dark:text-slate-400">
          Total: <span class="font-semibold text-slate-900 dark:text-white">{{ filteredItems.length }}</span> data
        </div>
      </div>
    </BaseCard>

    <!-- Data Table -->
    <BaseCard>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold">
            <tr>
              <th class="px-6 py-3">Nama</th>
              <th class="px-6 py-3">Status</th>
              <th class="px-6 py-3">Tanggal Dibuat</th>
              <th class="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="item in filteredItems" :key="item.id" class="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
              <td class="px-6 py-4 font-medium text-slate-900 dark:text-white">
                {{ item.name }}
              </td>
              <td class="px-6 py-4">
                <BaseBadge :variant="item.status === 'active' ? 'success' : 'neutral'">
                  {{ item.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                </BaseBadge>
              </td>
              <td class="px-6 py-4 text-slate-500 dark:text-slate-400">
                {{ item.createdAt }}
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <router-link :to="\`/admin/${kebab}/\${item.id}/edit\`">
                    <BaseButton variant="ghost" size="sm">
                      <Edit2 class="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </BaseButton>
                  </router-link>
                  <BaseButton variant="ghost" size="sm" @click="confirmDelete(item)">
                    <Trash2 class="w-4 h-4 text-rose-500" />
                  </BaseButton>
                </div>
              </td>
            </tr>
            <tr v-if="filteredItems.length === 0">
              <td colspan="4" class="px-6 py-12 text-center text-slate-500">
                Belum ada data ${title.toLowerCase()} ditemukan.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Download, Search, Edit2, Trash2 } from 'lucide-vue-next'
import BaseButton from '@/core/components/ui/BaseButton.vue'
import BaseCard from '@/core/components/ui/BaseCard.vue'
import BaseBadge from '@/core/components/ui/BaseBadge.vue'
import { exportToCsv } from '@/utils/exportCsv'

interface ${pascal}Item {
  id: string
  name: string
  status: 'active' | 'inactive'
  createdAt: string
}

const items = ref<${pascal}Item[]>([
  { id: '1', name: '${title} Contoh 1', status: 'active', createdAt: '2026-03-01' },
  { id: '2', name: '${title} Contoh 2', status: 'active', createdAt: '2026-03-02' }
])

const searchQuery = ref('')

const filteredItems = computed(() => {
  if (!searchQuery.value.trim()) return items.value
  const q = searchQuery.value.toLowerCase()
  return items.value.filter(i => i.name.toLowerCase().includes(q))
})

const handleExport = () => {
  exportToCsv({
    filename: '${kebab}-export.csv',
    columns: [
      { header: 'ID', key: 'id' },
      { header: 'Nama', key: 'name' },
      { header: 'Status', key: 'status' },
      { header: 'Tanggal', key: 'createdAt' }
    ],
    data: items.value
  })
}

const confirmDelete = (item: ${pascal}Item) => {
  if (confirm(\`Apakah Anda yakin ingin menghapus "\${item.name}"?\`)) {
    items.value = items.value.filter(i => i.id !== item.id)
  }
}
</script>
`

  // Generate FormView
  const formTemplate = `<template>
  <div class="max-w-3xl space-y-6">
    <!-- Breadcrumb & Title -->
    <div>
      <router-link to="/admin/${kebab}" class="text-sm font-medium text-indigo-600 hover:underline">
        &larr; Kembali ke Daftar ${title}
      </router-link>
      <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-2">
        {{ isEdit ? 'Edit ${title}' : 'Tambah ${title} Baru' }}
      </h1>
    </div>

    <BaseCard>
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Nama ${title} <span class="text-rose-500">*</span>
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            placeholder="Masukkan nama ${title.toLowerCase()}"
            class="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Status
          </label>
          <select
            v-model="form.status"
            class="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <router-link to="/admin/${kebab}">
            <BaseButton variant="outline">Batal</BaseButton>
          </router-link>
          <BaseButton variant="primary" type="submit">
            {{ isEdit ? 'Simpan Perubahan' : 'Buat ${title}' }}
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/core/components/ui/BaseButton.vue'
import BaseCard from '@/core/components/ui/BaseCard.vue'

const route = useRoute()
const router = useRouter()

const isEdit = computed(() => !!route.params.id)

const form = ref({
  name: '',
  status: 'active'
})

const handleSubmit = () => {
  alert(\`${title} berhasil disetor!\`)
  router.push('/admin/${kebab}')
}
</script>
`

  fs.writeFileSync(listFilePath, listTemplate, 'utf-8')
  fs.writeFileSync(formFilePath, formTemplate, 'utf-8')

  console.log(`\n${c.green}${c.bold}🎉 Scaffolding Admin Resource '${pascal}' Completed!${c.reset}`)
  console.log(`  ${c.cyan}List View:${c.reset} src/views/admin/${pascal}ListView.vue`)
  console.log(`  ${c.cyan}Form View:${c.reset} src/views/admin/${pascal}FormView.vue`)

  registerAdminRoutes({ kebabName: kebab, pascalName: pascal, title })
  registerAdminNavigation({ title, icon, route: `/admin/${kebab}`, roles })
  console.log(`  ${c.dim}Preview at: http://localhost:5173/admin/${kebab}${c.reset}\n`)
}

/**
 * make:storefront-page <Name>
 * Scaffolds a Storefront page, registers route in storefront.routes.ts
 */
function makeStorefrontPage(name, options) {
  if (!name) {
    console.error(`${c.red}Error: Page name is required.${c.reset} Example: npx cepat make:storefront-page AboutUs`)
    process.exit(1)
  }

  const kebab = toKebabCase(name)
  const pascal = toPascalCase(name)
  const title = options.title || toTitleCase(name)
  const routePath = options.route || `/${kebab}`
  const force = !!options.force

  const targetFile = path.join(ROOT, `src/views/storefront/${pascal}View.vue`)
  if (fs.existsSync(targetFile) && !force) {
    console.error(`${c.red}Error: File ${targetFile} already exists.${c.reset} Use --force to overwrite.`)
    process.exit(1)
  }

  const template = `<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center text-sm text-slate-500">
      <router-link to="/" class="hover:text-indigo-600 transition">Beranda</router-link>
      <span class="mx-2 text-slate-300">/</span>
      <span class="text-slate-900 font-medium">${title}</span>
    </nav>

    <!-- Header Banner -->
    <div class="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-8 sm:p-12 text-white shadow-lg">
      <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight">${title}</h1>
      <p class="mt-3 text-indigo-100 max-w-2xl text-base sm:text-lg">
        Informasi resmi dan layanan dari Cepat Store untuk pengalaman berbelanja terbaik.
      </p>
    </div>

    <!-- Main Content -->
    <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <h2 class="text-xl font-bold text-slate-900">Tentang Halaman Ini</h2>
      <p class="text-slate-600 leading-relaxed">
        Selamat datang di halaman ${title.toLowerCase()}. Halaman ini siap dikustomisasi sesuai kebutuhan bisnis Anda.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: '${title}',
  description: 'Halaman resmi ${title.toLowerCase()} toko online Cepat Store.'
})
</script>
`

  fs.writeFileSync(targetFile, template, 'utf-8')
  console.log(`\n${c.green}${c.bold}🎉 Scaffolding Storefront Page '${pascal}' Completed!${c.reset}`)
  console.log(`  ${c.cyan}View File:${c.reset} src/views/storefront/${pascal}View.vue`)

  registerStorefrontRoute({ kebabName: kebab, pascalName: pascal, title, routePath })
  console.log(`  ${c.dim}Preview at: http://localhost:5173${routePath}${c.reset}\n`)
}

/**
 * make:store <Name>
 * Scaffolds a Pinia store with CRUD actions and localStorage persistence.
 */
function makeStore(name, options) {
  if (!name) {
    console.error(`${c.red}Error: Store name is required.${c.reset} Example: npx cepat make:store Brand`)
    process.exit(1)
  }

  const kebab = toKebabCase(name)
  const pascal = toPascalCase(name)
  const camel = toCamelCase(name)
  const force = !!options.force

  const targetDir = path.join(ROOT, 'src/stores')
  ensureDir(targetDir)
  const targetFile = path.join(targetDir, `${kebab}.store.ts`)

  if (fs.existsSync(targetFile) && !force) {
    console.error(`${c.red}Error: File ${targetFile} already exists.${c.reset} Use --force to overwrite.`)
    process.exit(1)
  }

  const template = `import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface ${pascal}Item {
  id: string
  name: string
  status?: string
  createdAt?: string
  [key: string]: any
}

const STORAGE_KEY = 'cepat_${kebab}'

export const use${pascal}Store = defineStore('${kebab}', () => {
  const items = ref<${pascal}Item[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const count = computed(() => items.value.length)

  function load() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        items.value = JSON.parse(stored)
      }
    } catch (err) {
      console.error('Failed to load ${kebab} from storage', err)
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.value))
    } catch (err) {
      console.error('Failed to save ${kebab} to storage', err)
    }
  }

  function addItem(item: Omit<${pascal}Item, 'id'>) {
    const newItem: ${pascal}Item = {
      name: '',
      ...item,
      id: '${kebab}_' + Date.now(),
      createdAt: new Date().toISOString()
    }
    items.value.unshift(newItem)
    save()
    return newItem
  }

  function updateItem(id: string, updates: Partial<${pascal}Item>) {
    const idx = items.value.findIndex(i => i.id === id)
    if (idx !== -1) {
      items.value[idx] = { ...items.value[idx], ...updates }
      save()
      return items.value[idx]
    }
    return null
  }

  function deleteItem(id: string) {
    items.value = items.value.filter(i => i.id !== id)
    save()
  }

  // Auto initialize on store instantiation
  load()

  return {
    items,
    loading,
    error,
    count,
    load,
    addItem,
    updateItem,
    deleteItem
  }
})
`

  fs.writeFileSync(targetFile, template, 'utf-8')
  console.log(`\n${c.green}${c.bold}🎉 Pinia Store 'use${pascal}Store' Created!${c.reset}`)
  console.log(`  ${c.cyan}Location:${c.reset} src/stores/${kebab}.store.ts`)
  console.log(`  ${c.dim}Usage: import { use${pascal}Store } from '@/stores/${kebab}.store'${c.reset}\n`)
}

/**
 * make:mock-data <Name>
 * Scaffolds a mock seed file and registers it in src/mock/index.ts
 */
function makeMockData(name, options) {
  if (!name) {
    console.error(`${c.red}Error: Mock seed name is required.${c.reset} Example: npx cepat make:mock-data Brand`)
    process.exit(1)
  }

  const kebab = toKebabCase(name)
  const pascal = toPascalCase(name)
  const camel = toCamelCase(name)
  const force = !!options.force

  const targetFile = path.join(ROOT, `src/mock/${kebab}.seed.ts`)
  if (fs.existsSync(targetFile) && !force) {
    console.error(`${c.red}Error: File ${targetFile} already exists.${c.reset} Use --force to overwrite.`)
    process.exit(1)
  }

  const template = `export interface ${pascal}SeedItem {
  id: string
  name: string
  status: 'active' | 'inactive'
  createdAt: string
  [key: string]: any
}

export const ${camel}Seed: ${pascal}SeedItem[] = [
  {
    id: '${kebab}_1',
    name: '${toTitleCase(name)} Sample 1',
    status: 'active',
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: '${kebab}_2',
    name: '${toTitleCase(name)} Sample 2',
    status: 'active',
    createdAt: '2026-03-02T11:30:00Z'
  }
]
`

  fs.writeFileSync(targetFile, template, 'utf-8')
  console.log(`\n${c.green}${c.bold}🎉 Mock Data Seed Created!${c.reset}`)
  console.log(`  ${c.cyan}File:${c.reset} src/mock/${kebab}.seed.ts`)

  // Register in src/mock/index.ts
  const mockIndexFile = path.join(ROOT, 'src/mock/index.ts')
  if (fs.existsSync(mockIndexFile)) {
    let content = fs.readFileSync(mockIndexFile, 'utf-8')
    if (!content.includes(`${camel}Seed`)) {
      content = `import { ${camel}Seed } from './${kebab}.seed'\n` + content
      content = content.replace(/(export const STORAGE_KEYS = \{[\s\S]*?)(\})/, (match, p1, p2) => {
        return `${p1}  ${pascal.toUpperCase()}: 'cepat_olshop_${kebab}',\n${p2}`
      })
      fs.writeFileSync(mockIndexFile, content, 'utf-8')
      console.log(`  ${c.green}✓ Registered '${camel}Seed' into src/mock/index.ts${c.reset}`)
    }
  }
  console.log('')
}

/**
 * seed:reset
 * Verifies and resets mock database in local environment.
 */
function seedReset() {
  console.log(`\n${c.cyan}${c.bold}=== Cepat UI Olshop Demo Mock Data Reset ===${c.reset}\n`)
  const mockDir = path.join(ROOT, 'src/mock')
  if (fs.existsSync(mockDir)) {
    const seeds = fs.readdirSync(mockDir).filter(f => f.endsWith('.seed.ts'))
    console.log(`Found ${seeds.length} active mock seeds in ${c.bold}src/mock/${c.reset}:`)
    seeds.forEach(s => console.log(`  • ${c.green}${s}${c.reset}`))
  }

  console.log(`\n${c.green}${c.bold}✓ Mock data reset instructions:${c.reset}`)
  console.log(`  1. In the browser console: ${c.cyan}import('@/mock').then(m => m.resetMockData())${c.reset}`)
  console.log(`  2. Or clear localStorage keys starting with ${c.yellow}'cepat_'${c.reset}`)
  console.log(`  3. The app auto-reseeds on page reload via ${c.bold}initMockData()${c.reset}.\n`)
}

/**
 * make:adapter <category> <Name>
 * Generates custom adapter for shipping, storage, notification, or auth.
 */
function makeAdapter(arg1, arg2, options = {}) {
  let category = options.category
  let name = arg1

  if (arg2) {
    category = arg1
    name = arg2
  }

  if (!category) {
    category = 'auth'
  }

  if (!name) {
    console.error(`${c.red}Error: Adapter name is required.${c.reset} Example: npx cepat make:adapter shipping jne`)
    process.exit(1)
  }

  const kebab = toKebabCase(name)
  const pascal = toPascalCase(name)

  if (category === 'shipping') {
    const targetFile = path.join(ROOT, `src/adapters/shipping/${kebab}.adapter.ts`)
    const template = `import type { ShippingAdapter, ShippingRateRequest, ShippingRateResult } from './adapter.interface'

export class ${pascal}ShippingAdapter implements ShippingAdapter {
  readonly name = '${kebab}'

  async calculateRates(request: ShippingRateRequest): Promise<ShippingRateResult[]> {
    // TODO: Implement ${pascal} shipping rate calculation
    return [
      {
        courier: '${pascal.toUpperCase()}',
        service: 'REG',
        cost: 15000,
        estimatedDays: '2-3 Hari',
        description: 'Layanan Reguler'
      }
    ]
  }

  async trackShipment(trackingNumber: string, courier: string) {
    return {
      trackingNumber,
      courier,
      status: 'On Delivery',
      history: []
    }
  }
}
`
    fs.writeFileSync(targetFile, template, 'utf-8')
    console.log(`\n${c.green}${c.bold}✓ Shipping adapter created:${c.reset} src/adapters/shipping/${kebab}.adapter.ts\n`)
    return
  }

  if (category === 'storage') {
    const targetFile = path.join(ROOT, `src/adapters/storage/${kebab}.adapter.ts`)
    const template = `import type { StorageAdapter, UploadResult, UploadOptions } from './adapter.interface'

export class ${pascal}StorageAdapter implements StorageAdapter {
  readonly name = '${kebab}'

  async upload(file: File, options?: UploadOptions): Promise<UploadResult> {
    // TODO: Implement ${pascal} file upload
    return {
      url: URL.createObjectURL(file),
      path: file.name,
      size: file.size,
      mimeType: file.type
    }
  }

  async delete(urlOrPath: string): Promise<boolean> {
    return true
  }

  getUrl(path: string): string {
    return path
  }
}
`
    fs.writeFileSync(targetFile, template, 'utf-8')
    console.log(`\n${c.green}${c.bold}✓ Storage adapter created:${c.reset} src/adapters/storage/${kebab}.adapter.ts\n`)
    return
  }

  if (category === 'notification') {
    const targetFile = path.join(ROOT, `src/adapters/notification/${kebab}.adapter.ts`)
    const template = `import type { NotificationAdapter, NotificationCallback } from './adapter.interface'

export class ${pascal}NotificationAdapter implements NotificationAdapter {
  readonly name = '${kebab}'

  subscribe(userId: string, callback: NotificationCallback): () => void {
    // TODO: Implement subscription
    return () => {}
  }

  async markAsRead(notificationId: string): Promise<void> {}
  async markAllAsRead(): Promise<void> {}
}
`
    fs.writeFileSync(targetFile, template, 'utf-8')
    console.log(`\n${c.green}${c.bold}✓ Notification adapter created:${c.reset} src/adapters/notification/${kebab}.adapter.ts\n`)
    return
  }

  // Default: auth adapter
  const targetFile = path.join(ROOT, 'src/core/auth', `${kebab}.adapter.ts`)
  const template = `import type { AuthAdapter, AuthResponse, LoginPayload, RegisterPayload, User } from './types'

export class ${pascal}AuthAdapter implements AuthAdapter {
  readonly name = '${kebab}'

  async login(payload: LoginPayload): Promise<AuthResponse> {
    throw new Error('Method not implemented.')
  }

  async logout(): Promise<void> {}

  async getUser(): Promise<User | null> {
    return null
  }

  async register?(payload: RegisterPayload): Promise<AuthResponse> {
    throw new Error('Method not implemented.')
  }
}

export const ${kebab}AuthAdapter = new ${pascal}AuthAdapter()
`
  fs.writeFileSync(targetFile, template, 'utf-8')
  console.log(`\n${c.green}${c.bold}✓ Auth adapter created:${c.reset} src/core/auth/${kebab}.adapter.ts\n`)
}

/**
 * use:adapter <category> <type>
 * Switch active adapter for shipping, storage, notification, or auth.
 */
function useAdapter(category, type, options = {}) {
  if (!category || !type) {
    console.log(`\n${c.bold}Usage:${c.reset} npx cepat use:adapter <category> <type>`)
    console.log(`\n${c.cyan}Categories & Available Types:${c.reset}`)
    console.log(`  • ${c.bold}shipping:${c.reset} manual, rajaongkir`)
    console.log(`  • ${c.bold}storage:${c.reset} local, indexed-db, cloudinary`)
    console.log(`  • ${c.bold}notification:${c.reset} polling, websocket`)
    console.log(`  • ${c.bold}payment:${c.reset} manual, xendit`)
    console.log(`  • ${c.bold}auth:${c.reset} mock, sanctum\n`)
    return
  }

  const cat = category.toLowerCase()
  const t = type.toLowerCase()

  if (cat === 'shipping') {
    const file = path.join(ROOT, 'src/adapters/shipping/index.ts')
    if (t === 'manual') {
      const code = `import type { ShippingAdapter } from './adapter.interface'
import { ManualShippingAdapter } from './manual.adapter'

export * from './adapter.interface'
export * from './manual.adapter'
export * from './rajaongkir.adapter'

export const shippingAdapter: ShippingAdapter = new ManualShippingAdapter()
`
      fs.writeFileSync(file, code, 'utf-8')
      console.log(`\n${c.green}${c.bold}✓ Switched active Shipping Adapter to ManualShippingAdapter${c.reset}\n`)
      return
    }
    if (t === 'rajaongkir') {
      const code = `import type { ShippingAdapter } from './adapter.interface'
import { RajaOngkirAdapter } from './rajaongkir.adapter'

export * from './adapter.interface'
export * from './manual.adapter'
export * from './rajaongkir.adapter'

export const shippingAdapter: ShippingAdapter = new RajaOngkirAdapter()
`
      fs.writeFileSync(file, code, 'utf-8')
      console.log(`\n${c.green}${c.bold}✓ Switched active Shipping Adapter to RajaOngkirAdapter${c.reset}\n`)
      return
    }
    console.error(`${c.red}Unknown shipping type: ${t}.${c.reset} Available: manual, rajaongkir`)
    return
  }

  if (cat === 'storage') {
    const file = path.join(ROOT, 'src/adapters/storage/index.ts')
    let adapterClass = 'IndexedDbStorageAdapter'
    if (t === 'local') adapterClass = 'LocalStorageAdapter'
    else if (t === 'cloudinary') adapterClass = 'CloudinaryStorageAdapter'
    else if (t === 'indexed-db' || t === 'indexeddb') adapterClass = 'IndexedDbStorageAdapter'
    else {
      console.error(`${c.red}Unknown storage type: ${t}.${c.reset} Available: local, indexed-db, cloudinary`)
      return
    }

    const code = `import type { StorageAdapter } from './adapter.interface'
import { ${adapterClass} } from './${t === 'local' ? 'local.adapter' : (t === 'cloudinary' ? 'cloudinary.adapter' : 'indexed-db.adapter')}'

export * from './adapter.interface'
export * from './local.adapter'
export * from './indexed-db.adapter'
export * from './cloudinary.adapter'

export const storageAdapter: StorageAdapter = new ${adapterClass}()
`
    fs.writeFileSync(file, code, 'utf-8')
    console.log(`\n${c.green}${c.bold}✓ Switched active Storage Adapter to ${adapterClass}${c.reset}\n`)
    return
  }

  if (cat === 'notification') {
    const file = path.join(ROOT, 'src/adapters/notification/index.ts')
    if (t === 'polling') {
      const code = `import type { NotificationAdapter } from './adapter.interface'
import { PollingNotificationAdapter } from './polling.adapter'

export * from './adapter.interface'
export * from './polling.adapter'
export * from './websocket.adapter'

export const notificationAdapter: NotificationAdapter = new PollingNotificationAdapter(30)
`
      fs.writeFileSync(file, code, 'utf-8')
      console.log(`\n${c.green}${c.bold}✓ Switched active Notification Adapter to PollingNotificationAdapter${c.reset}\n`)
      return
    }
    if (t === 'websocket' || t === 'ws' || t === 'realtime') {
      const code = `import type { NotificationAdapter } from './adapter.interface'
import { WebSocketNotificationAdapter } from './websocket.adapter'

export * from './adapter.interface'
export * from './polling.adapter'
export * from './websocket.adapter'

export const notificationAdapter: NotificationAdapter = new WebSocketNotificationAdapter()
`
      fs.writeFileSync(file, code, 'utf-8')
      console.log(`\n${c.green}${c.bold}✓ Switched active Notification Adapter to WebSocketNotificationAdapter${c.reset}\n`)
      return
    }
    console.error(`${c.red}Unknown notification type: ${t}.${c.reset} Available: polling, websocket`)
    return
  }

  if (cat === 'payment') {
    const file = path.join(ROOT, 'src/adapters/payment/index.ts')
    if (t === 'manual') {
      const code = `import type { PaymentAdapter } from './adapter.interface'
import { ManualPaymentAdapter } from './manual.adapter'

export * from './adapter.interface'
export * from './manual.adapter'
export * from './xendit.adapter'

export const paymentAdapter: PaymentAdapter = new ManualPaymentAdapter()
`
      fs.writeFileSync(file, code, 'utf-8')
      console.log(`\n${c.green}${c.bold}✓ Switched active Payment Adapter to ManualPaymentAdapter${c.reset}\n`)
      return
    }
    if (t === 'xendit') {
      const code = `import type { PaymentAdapter } from './adapter.interface'
import { XenditPaymentAdapter } from './xendit.adapter'

export * from './adapter.interface'
export * from './manual.adapter'
export * from './xendit.adapter'

export const paymentAdapter: PaymentAdapter = new XenditPaymentAdapter()
`
      fs.writeFileSync(file, code, 'utf-8')
      console.log(`\n${c.green}${c.bold}✓ Switched active Payment Adapter to XenditPaymentAdapter${c.reset}\n`)
      return
    }
    console.error(`${c.red}Unknown payment type: ${t}.${c.reset} Available: manual, xendit`)
    return
  }

  if (cat === 'auth') {
    useBackend(t, options)
    return
  }

  console.error(`${c.red}Unknown adapter category: ${category}.${c.reset}`)
}

function useBackend(type, options = {}) {
  const authPluginFile = path.join(ROOT, 'src/plugins/auth.ts')
  const envFile = path.join(ROOT, '.env')
  let envContent = fs.existsSync(envFile) ? fs.readFileSync(envFile, 'utf-8') : ''

  if (type === 'mock') {
    const pluginCode = `// src/plugins/auth.ts
// Configured by: cepat use:backend mock
import { MockAuthAdapter } from '@/core/auth'

export const authAdapter = new MockAuthAdapter()
`
    fs.writeFileSync(authPluginFile, pluginCode, 'utf-8')
    console.log(`\n${c.green}${c.bold}✓ Switched to Mock Auth Adapter${c.reset}`)
    console.log(`  ${c.dim}Demo mode active. In-memory authentication.${c.reset}\n`)
    return
  }

  if (type === 'sanctum' || type === 'laravel') {
    const pluginCode = `// src/plugins/auth.ts
// Configured by: cepat use:backend sanctum
import { LaravelSanctumAdapter } from '@/core/auth'

export const authAdapter = new LaravelSanctumAdapter()
`
    fs.writeFileSync(authPluginFile, pluginCode, 'utf-8')
    const apiUrl = options.url || 'http://localhost:8000'
    if (!envContent.includes('VITE_API_URL=')) {
      envContent += `\n# Backend API URL\nVITE_API_URL=${apiUrl}\n`
    } else {
      envContent = envContent.replace(/VITE_API_URL=.*/, `VITE_API_URL=${apiUrl}`)
    }
    fs.writeFileSync(envFile, envContent.trim() + '\n', 'utf-8')
    console.log(`\n${c.green}${c.bold}🎉 Switched to Laravel Sanctum Auth Adapter!${c.reset}`)
    console.log(`  ${c.cyan}API Base URL:${c.reset} ${apiUrl} (saved in .env)\n`)
    return
  }

  console.error(`${c.red}Unknown backend auth type: ${type}.${c.reset} Available: mock, sanctum`)
}

// =========================================================================
// ADDON COMMANDS
// =========================================================================

function addonPwa() {
  console.log(`\n${c.cyan}${c.bold}=== PWA (Progressive Web App) Addon ===${c.reset}`)
  console.log(`  ${c.green}✓${c.reset} Web App Manifest: ${c.bold}public/manifest.json${c.reset}`)
  console.log(`  ${c.green}✓${c.reset} Service Worker Helper: ${c.bold}src/addons/pwa/registerServiceWorker.ts${c.reset}`)
  console.log(`  ${c.dim}Run 'npm i -D vite-plugin-pwa' if you wish to enable automatic offline caching.${c.reset}\n`)
}

function addonAnalytics() {
  console.log(`\n${c.cyan}${c.bold}=== Analytics Addon ===${c.reset}`)
  console.log(`  ${c.green}✓${c.reset} Composable: ${c.bold}src/composables/useAnalytics.ts${c.reset}`)
  console.log(`  Supported platforms: Google Analytics 4 (GA4) & Plausible`)
  console.log(`  Events included: trackViewItem, trackAddToCart, trackPurchase, trackPageView\n`)
}

function addonEmail() {
  console.log(`\n${c.cyan}${c.bold}=== Email Notification Templates Addon ===${c.reset}`)
  console.log(`  ${c.green}✓${c.reset} Order Confirmation: ${c.bold}src/addons/email/order-confirmation.html${c.reset}`)
  console.log(`  ${c.green}✓${c.reset} Shipping Tracking: ${c.bold}src/addons/email/shipping-update.html${c.reset}`)
  console.log(`  ${c.green}✓${c.reset} Reset Password: ${c.bold}src/addons/email/reset-password.html${c.reset}`)
  console.log(`  ${c.green}✓${c.reset} Mailer Adapter: ${c.bold}src/addons/email/mailer.ts${c.reset}\n`)
}

function addonPdfExport() {
  console.log(`\n${c.cyan}${c.bold}=== Client-side PDF Export Addon ===${c.reset}`)
  console.log(`  ${c.green}✓${c.reset} Export Utility: ${c.bold}src/utils/exportPdf.ts${c.reset}`)
  console.log(`  ${c.dim}Usage: exportToPdf(elementOrHtml, { title: 'Faktur-123' })${c.reset}\n`)
}

function addonI18n() {
  console.log(`\n${c.cyan}${c.bold}=== i18n & Multi-Currency Addon ===${c.reset}`)
  console.log(`  ${c.green}✓${c.reset} ID Locale: ${c.bold}src/addons/i18n/id.json${c.reset}`)
  console.log(`  ${c.green}✓${c.reset} EN Locale: ${c.bold}src/addons/i18n/en.json${c.reset}`)
  console.log(`  ${c.green}✓${c.reset} Composable: ${c.bold}src/addons/i18n/index.ts${c.reset}\n`)
}

function listRoutes() {
  const routerFile = path.join(ROOT, 'src/router/index.ts')
  console.log(`\n${c.bold}=== Registered Olshop Routes ===${c.reset}\n`)
  if (fs.existsSync(routerFile)) {
    console.log(`  Admin routes defined in: ${c.cyan}src/router/admin.routes.ts${c.reset}`)
    console.log(`  Storefront routes defined in: ${c.cyan}src/router/storefront.routes.ts${c.reset}\n`)
  }
}

function printHelp() {
  console.log(banner)
  console.log(`${c.bold}COMMANDS:${c.reset}
  ${c.cyan}make:admin-resource <Name>${c.reset}  Scaffold full Admin CRUD view, form, router, and navigation
  ${c.cyan}make:storefront-page <Name>${c.reset} Scaffold a new storefront page with SEO integration
  ${c.cyan}make:store <Name>${c.reset}            Generate a Pinia store with localStorage sync
  ${c.cyan}make:mock-data <Name>${c.reset}        Scaffold a mock seed file and register in mock/index.ts
  ${c.cyan}seed:reset${c.reset}                   Reset & re-initialize mock database
  ${c.cyan}make:adapter <cat> <Name>${c.reset}   Generate custom adapter (shipping, storage, notification, auth)
  ${c.cyan}use:adapter <cat> <type>${c.reset}    Switch active adapter
  ${c.cyan}addon:<pwa|analytics|email|pdf-export|i18n>${c.reset} Inspect addon tools & configurations
  ${c.cyan}list:routes${c.reset}                  List registered routes

${c.bold}OPTIONS:${c.reset}
  ${c.yellow}--title="Title"${c.reset}        Custom display title
  ${c.yellow}--route=/path${c.reset}          Custom URL route
  ${c.yellow}--icon=IconName${c.reset}        Lucide icon name (e.g. Package, ShoppingCart)
  ${c.yellow}--force${c.reset}                Overwrite existing files
`)
}

// --- Main CLI dispatch ---
const args = process.argv.slice(2)
const parsed = parseArgs(args)
const command = parsed._[0]
const arg1 = parsed._[1]
const arg2 = parsed._[2]

switch (command) {
  case 'make:admin-resource':
  case 'make:crud':
    makeAdminResource(arg1, parsed.options)
    break
  case 'make:storefront-page':
  case 'make:page':
    makeStorefrontPage(arg1, parsed.options)
    break
  case 'make:store':
    makeStore(arg1, parsed.options)
    break
  case 'make:mock-data':
    makeMockData(arg1, parsed.options)
    break
  case 'seed:reset':
    seedReset()
    break
  case 'make:adapter':
    makeAdapter(arg1, arg2, parsed.options)
    break
  case 'use:adapter':
    useAdapter(arg1, arg2, parsed.options)
    break
  case 'use:backend':
  case 'backend':
    useBackend(arg1, parsed.options)
    break
  case 'addon:pwa':
    addonPwa()
    break
  case 'addon:analytics':
    addonAnalytics()
    break
  case 'addon:email':
    addonEmail()
    break
  case 'addon:pdf-export':
    addonPdfExport()
    break
  case 'addon:i18n':
    addonI18n()
    break
  case 'addon:payment':
  case 'addon:xendit':
  case 'addon:payment-xendit':
    useAdapter('payment', arg1 || 'xendit', parsed.options)
    console.log(`  ${c.dim}To customize Xendit keys, update VITE_XENDIT_PUBLIC_KEY in .env${c.reset}\n`)
    break
  case 'addon:realtime':
    useAdapter('notification', 'websocket', parsed.options)
    break
  case 'addon:storage':
    useAdapter('storage', arg1 || 'indexed-db', parsed.options)
    break
  case 'list:routes':
  case 'routes':
    listRoutes()
    break
  case 'help':
  case '--help':
  case '-h':
  case undefined:
    printHelp()
    break
  default:
    console.error(`${c.red}Unknown command: ${command}${c.reset}`)
    printHelp()
    process.exit(1)
}
