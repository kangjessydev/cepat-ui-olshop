import { onMounted, watch } from 'vue'

export interface SeoOptions {
  title: string
  description?: string
  image?: string
}

export function useSeo(options: SeoOptions | (() => SeoOptions)) {
  function applySeo() {
    const opts = typeof options === 'function' ? options() : options

    // 1. Title Tag
    const siteTitle = 'Cepat Olshop — Toko Online Cepat & Terpercaya'
    document.title = opts.title ? `${opts.title} | Cepat Olshop` : siteTitle

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]')
    if (!metaDesc) {
      metaDesc = document.createElement('meta')
      metaDesc.setAttribute('name', 'description')
      document.head.appendChild(metaDesc)
    }
    metaDesc.setAttribute(
      'content',
      opts.description || 'Belanja online cepat, mudah, dan aman dengan berbagai pilihan produk berkualitas di Cepat Olshop.'
    )

    // 3. Open Graph Tags
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.setAttribute('content', opts.title || siteTitle)

    if (opts.image) {
      let ogImage = document.querySelector('meta[property="og:image"]')
      if (!ogImage) {
        ogImage = document.createElement('meta')
        ogImage.setAttribute('property', 'og:image')
        document.head.appendChild(ogImage)
      }
      ogImage.setAttribute('content', opts.image)
    }
  }

  onMounted(() => {
    applySeo()
  })

  if (typeof options === 'function') {
    watch(options, applySeo, { deep: true })
  }
}
