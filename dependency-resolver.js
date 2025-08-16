/* Dependency Resolver for AnimateItNow templates */

class DependencyManager {
  constructor(options = {}) {
    this.cdnMap = {
      "gsap": {
        url: (version) => `https://cdn.jsdelivr.net/npm/gsap@${version || '3'}/dist/gsap.min.js`,
        defaultVersion: '3',
        type: 'js'
      },
      "animate.css": {
        url: (version) => `https://cdn.jsdelivr.net/npm/animate.css@${version || '4'}/animate.min.css`,
        defaultVersion: '4',
        type: 'css'
      }
    }
    this.loaded = new Set()
    this.logger = options.logger || console
    this.timeoutMs = options.timeoutMs || 15000
  }

  async resolveDependencies(manifest) {
    const external = (manifest?.dependencies?.external || [])
    const results = { loaded: [], skipped: [], errors: [] }

    for (const depEntry of external) {
      const { name, version } = this.normalizeDependency(depEntry)
      if (this.loaded.has(name)) {
        results.skipped.push(name)
        continue
      }
      try {
        await this.loadFromCDN(name, version)
        this.loaded.add(name)
        results.loaded.push(name)
      } catch (err) {
        this.logger.error(`Failed to load dependency: ${name}`, err)
        results.errors.push({ name, error: String(err) })
      }
    }

    return results
  }

  normalizeDependency(entry) {
    if (typeof entry === 'string') {
      return { name: entry, version: undefined }
    }
    if (entry && typeof entry === 'object') {
      return { name: entry.name, version: entry.version }
    }
    return { name: String(entry || ''), version: undefined }
  }

  async loadFromCDN(name, version) {
    const meta = this.cdnMap[name]
    if (!meta) throw new Error(`Unknown dependency '${name}'.`)

    const url = meta.url(version || meta.defaultVersion)
    if (meta.type === 'js') {
      await this.injectScript(url)
    } else if (meta.type === 'css') {
      await this.injectStylesheet(url)
    } else {
      throw new Error(`Unsupported dependency type for '${name}'.`)
    }
  }

  injectScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = src
      script.async = true
      const timer = setTimeout(() => {
        script.remove()
        reject(new Error(`Timeout loading script: ${src}`))
      }, this.timeoutMs)
      script.onload = () => { clearTimeout(timer); resolve() }
      script.onerror = () => { clearTimeout(timer); reject(new Error(`Network error for ${src}`)) }
      document.head.appendChild(script)
    })
  }

  injectStylesheet(href) {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      const timer = setTimeout(() => {
        link.remove()
        reject(new Error(`Timeout loading stylesheet: ${href}`))
      }, this.timeoutMs)
      link.onload = () => { clearTimeout(timer); resolve() }
      link.onerror = () => { clearTimeout(timer); reject(new Error(`Network error for ${href}`)) }
      document.head.appendChild(link)
    })
  }
}

window.DependencyManager = DependencyManager