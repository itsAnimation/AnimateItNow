/* Package Validator for .animpack files */

class PackageValidator {
  constructor(options = {}) {
    this.maxSizeBytes = options.maxSizeBytes || 50 * 1024 * 1024 // 50MB
    this.requiredFiles = options.requiredFiles || [
      'manifest.json',
      'index.html',
      'styles.css',
      'script.js',
      'dependencies.json'
    ]
  }

  async validatePackage(zip) {
    const errors = []
    const warnings = []

    // total size
    let totalBytes = 0
    zip.forEach((path, entry) => { totalBytes += entry._data?.uncompressedSize || 0 })
    if (totalBytes > this.maxSizeBytes) errors.push(`Package exceeds ${Math.round(this.maxSizeBytes/1024/1024)}MB limit.`)

    const manifestEntry = zip.file('manifest.json')
    if (!manifestEntry) errors.push('Missing manifest.json')

    let manifest = null
    if (manifestEntry) {
      try {
        const manifestText = await manifestEntry.async('text')
        manifest = JSON.parse(manifestText)
      } catch (e) {
        errors.push('manifest.json is not valid JSON')
      }
    }

    // schema checks
    if (manifest) {
      const requiredFields = ['name', 'version', 'author']
      for (const f of requiredFields) {
        if (!manifest[f]) errors.push(`manifest.json missing field: ${f}`)
      }
      if (!manifest.dependencies || typeof manifest.dependencies !== 'object') {
        warnings.push('manifest.dependencies missing; assuming none')
      }
    }

    // file presence
    for (const f of this.requiredFiles) {
      if (!zip.file(f)) warnings.push(`Optional or missing file: ${f}`)
    }

    // assets listed present
    if (manifest?.assets && Array.isArray(manifest.assets)) {
      for (const asset of manifest.assets) {
        if (!zip.file(asset)) warnings.push(`Listed asset not found: ${asset}`)
      }
    }

    const result = { valid: errors.length === 0, errors, warnings, manifest }
    return result
  }
}

window.PackageValidator = PackageValidator