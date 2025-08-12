/* Template Manager for AnimateItNow */

;(function () {
  const PACKAGE_EXT = '.animpack'

  function nowIso() { return new Date().toISOString() }

  function blobDownload(blob, filename) {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    setTimeout(() => {
      a.remove(); URL.revokeObjectURL(url)
    }, 0)
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = () => reject(reader.error)
      reader.readAsText(file)
    })
  }

  function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('AnimateItNowDB', 1)
      req.onupgradeneeded = (e) => {
        const db = req.result
        if (!db.objectStoreNames.contains('templates')) {
          db.createObjectStore('templates', { keyPath: 'name' })
        }
      }
      req.onsuccess = () => resolve(req.result)
      req.onerror = () => reject(req.error)
    })
  }

  async function putTemplateRecord(record) {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('templates', 'readwrite')
      const store = tx.objectStore('templates')
      store.put(record)
      tx.oncomplete = () => resolve(true)
      tx.onerror = () => reject(tx.error)
    })
  }

  async function getAllTemplateRecords() {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('templates', 'readonly')
      const store = tx.objectStore('templates')
      const req = store.getAll()
      req.onsuccess = () => resolve(req.result || [])
      req.onerror = () => reject(req.error)
    })
  }

  async function getTemplateRecord(name) {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const tx = db.transaction('templates', 'readonly')
      const store = tx.objectStore('templates')
      const req = store.get(name)
      req.onsuccess = () => resolve(req.result || null)
      req.onerror = () => reject(req.error)
    })
  }

  class TemplatePackager {
    constructor() { this.zip = null }

    async createPackage(templateData, options = {}) {
      if (!window.JSZip) throw new Error('JSZip not loaded')
      const zip = new JSZip()

      // Files
      zip.file('index.html', templateData.indexHtml || '')
      zip.file('styles.css', templateData.stylesCss || '')
      zip.file('script.js', templateData.scriptJs || '')

      // Assets
      if (Array.isArray(templateData.assets)) {
        for (const asset of templateData.assets) {
          // asset: { path, blob | dataUrl }
          if (asset.blob) {
            zip.file(asset.path, asset.blob)
          } else if (asset.dataUrl) {
            const base64 = asset.dataUrl.split(',')[1]
            zip.file(asset.path, base64, { base64: true })
          }
        }
      }

      // dependencies.json from options or templateData
      const dependencies = templateData.dependencies || options.dependencies || { external: [] }
      zip.file('dependencies.json', JSON.stringify(dependencies, null, 2))

      // Manifest
      const manifest = {
        name: templateData.name || 'Template',
        version: templateData.version || '1.0.0',
        author: templateData.author || 'Unknown',
        description: templateData.description || '',
        tags: templateData.tags || [],
        dependencies: { external: dependencies.external || [], files: ['styles.css', 'script.js'] },
        assets: (templateData.assets || []).map(a => a.path),
        created: nowIso(),
        preview: templateData.preview || ''
      }
      zip.file('manifest.json', JSON.stringify(manifest, null, 2))

      // Compression
      const compression = options.compression || 'DEFLATE'
      const level = options.compressionLevel ?? 6
      const blob = await zip.generateAsync({ type: 'blob', compression, compressionOptions: { level } }, (metadata) => {
        if (options.onProgress) options.onProgress(metadata.percent || 0)
      })
      return { blob, manifest }
    }

    async exportBulk(templateItems, options = {}) {
      if (!Array.isArray(templateItems) || templateItems.length === 0) {
        throw new Error('No templates selected for export')
      }
      if (!window.JSZip) throw new Error('JSZip not loaded')
      const zip = new JSZip()

      let idx = 0
      for (const item of templateItems) {
        const { blob } = await new TemplatePackager().createPackage(item, { compression: options.compression, compressionLevel: options.compressionLevel })
        const arrayBuffer = await blob.arrayBuffer()
        const fileNameSafe = (item.name || `template_${idx+1}`).replace(/[^a-z0-9-_]+/gi, '_')
        zip.file(`${fileNameSafe}${PACKAGE_EXT}`, arrayBuffer)
        idx++
      }

      const bulkBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } }, (metadata) => {
        if (options.onProgress) options.onProgress(metadata.percent || 0)
      })
      return { blob: bulkBlob }
    }
  }

  class TemplateImporter {
    constructor() {
      this.validator = new (window.PackageValidator || function(){})()
      this.deps = new (window.DependencyManager || function(){})()
    }

    async importPackage(file, options = {}) {
      if (!file) throw new Error('No package file provided')
      if (!window.JSZip) throw new Error('JSZip not loaded')
      const isZip = file.name.endsWith(PACKAGE_EXT)
      if (!isZip) throw new Error('Invalid file type. Please select a .animpack file')

      let zip
      try {
        const arrayBuffer = await file.arrayBuffer()
        zip = await JSZip.loadAsync(arrayBuffer)
      } catch (e) {
        throw new Error('Could not read package. File may be corrupted')
      }

      const validation = await this.validatePackage(zip)
      if (!validation.valid) {
        throw new Error(`Package invalid: ${validation.errors.join('; ')}`)
      }

      let manifest = validation.manifest

      // Merge dependencies.json if present
      try {
        const depEntry = zip.file('dependencies.json')
        if (depEntry) {
          const depText = await depEntry.async('text')
          const depJson = JSON.parse(depText)
          if (!manifest.dependencies) manifest.dependencies = {}
          const ext = new Set([...(manifest.dependencies.external || []), ...(depJson.external || [])])
          manifest.dependencies.external = Array.from(ext)
        }
      } catch (_) {}

      // Resolve dependencies
      const depResult = await this.deps.resolveDependencies(manifest)
      if (depResult.errors.length) {
        if (options.strict) throw new Error(`Dependencies failed: ${depResult.errors.map(e=>e.name).join(', ')}`)
      }

      // Extract required files
      const indexHtml = await zip.file('index.html')?.async('text')
      const stylesCss = await zip.file('styles.css')?.async('text')
      const scriptJs = await zip.file('script.js')?.async('text')

      // Collect assets as dataUrls for storage
      const assets = []
      const assetList = manifest.assets || []
      for (const assetPath of assetList) {
        const entry = zip.file(assetPath)
        if (!entry) continue
        const blob = await entry.async('blob')
        assets.push({ path: assetPath, blob })
      }

      // Conflict resolution: rename if existing
      let name = manifest.name
      const existing = await getTemplateRecord(name)
      if (existing && options.onConflict) {
        const action = await options.onConflict({ name, existing }) // 'overwrite' | 'duplicate' | 'skip'
        if (action === 'skip') return { skipped: true }
        if (action === 'duplicate') {
          let suffix = 2
          while (await getTemplateRecord(`${name} (${suffix})`)) suffix++
          name = `${name} (${suffix})`
        }
      }

      const record = {
        name,
        manifest: { ...manifest, name },
        indexHtml,
        stylesCss,
        scriptJs,
        assetsMeta: assets.map(a => a.path),
        installedAt: nowIso()
      }

      await putTemplateRecord(record)

      return { installed: true, name, manifest: record.manifest }
    }

    async validatePackage(zipFile) {
      if (!this.validator || typeof this.validator.validatePackage !== 'function') {
        return { valid: true, errors: [], warnings: [], manifest: null }
      }
      return await this.validator.validatePackage(zipFile)
    }
  }

  function initTemplateManagerUI() {
    // Inject toolbar above templates grid
    const main = document.querySelector('.templates-main')
    const grid = document.querySelector('.templates-grid')
    if (!main || !grid) return

    // Add stylesheet
    const cssLink = document.createElement('link')
    cssLink.rel = 'stylesheet'
    cssLink.href = 'template-manager.css'
    document.head.appendChild(cssLink)

    const toolbar = document.getElementById('btn-import') ? null : document.createElement('div')
    if (toolbar) {
      toolbar.className = 'template-toolbar'
      toolbar.innerHTML = `
        <button class="btn" id="btn-import">Import</button>
        <button class="btn" id="btn-export-selected">Export Selected</button>
        <button class="btn secondary" id="btn-export-all">Export All</button>
        <span id="export-status" style="margin-left:8px;color:#94a3b8"></span>
      `
      main.insertBefore(toolbar, main.children[2] || grid)
    }

    // Add checkboxes to each template card
    document.querySelectorAll('.template-card').forEach((card) => {
      if (!card.classList.contains('selectable')) card.classList.add('selectable')
      if (card.querySelector('.template-select-checkbox')) return
      const checkbox = document.createElement('input')
      checkbox.type = 'checkbox'
      checkbox.className = 'template-select-checkbox'
      checkbox.title = 'Select for export'
      checkbox.addEventListener('click', (e) => { e.stopPropagation(); e.preventDefault(); checkbox.checked = !checkbox.checked; card.classList.toggle('selected', checkbox.checked) })
      checkbox.addEventListener('change', (e) => { e.stopPropagation(); card.classList.toggle('selected', checkbox.checked) })
      card.prepend(checkbox)

      // Prevent navigation when interacting within checkbox area
      card.addEventListener('click', (e) => {
        const target = e.target
        if (target === checkbox) {
          e.preventDefault(); e.stopPropagation()
        }
      }, true)
    })

    // Create modals
    createExportModal()
    createImportModal()

    // Wire events
    const importer = new TemplateImporter()
    const packager = new TemplatePackager()

    document.getElementById('btn-export-selected').addEventListener('click', async () => {
      const selected = [...document.querySelectorAll('.template-select-checkbox:checked')]
        .map(cb => cb.closest('.template-card'))
      if (selected.length === 0) {
        alert('Select at least one template')
        return
      }
      openExportModal(async (options, setProgress) => {
        const items = await gatherTemplateItems(selected)
        const { blob } = await packager.exportBulk(items, { ...options, onProgress: p => setProgress(p) })
        blobDownload(blob, `templates-bulk${PACKAGE_EXT}`)
      })
    })

    document.getElementById('btn-export-all').addEventListener('click', async () => {
      const allCards = [...document.querySelectorAll('.template-card')]
      openExportModal(async (options, setProgress) => {
        const items = await gatherTemplateItems(allCards)
        const { blob } = await packager.exportBulk(items, { ...options, onProgress: p => setProgress(p) })
        blobDownload(blob, `all-templates${PACKAGE_EXT}`)
      })
    })

    document.getElementById('btn-import').addEventListener('click', () => {
      openImportModal(async (file, controls) => {
        try {
          const result = await importer.importPackage(file, {
            strict: false,
            onConflict: async ({ name }) => {
              return await controls.pickConflictResolution(name)
            }
          })
          controls.setStatus(`Installed: ${result.name}`)
          await refreshGalleryFromDB()
        } catch (e) {
          controls.setError(String(e?.message || e))
        }
      })
    })
  }

  async function refreshGalleryFromDB() {
    const grid = document.querySelector('.templates-grid')
    if (!grid) return
    const records = await getAllTemplateRecords()
    if (!Array.isArray(records) || records.length === 0) return

    // Append imported templates section
    let sectionHeader = document.getElementById('imported-templates-header')
    if (!sectionHeader) {
      sectionHeader = document.createElement('h2')
      sectionHeader.id = 'imported-templates-header'
      sectionHeader.textContent = 'Imported Templates'
      sectionHeader.style.margin = '24px 0 8px'
      grid.parentElement.appendChild(sectionHeader)
    }

    // Container for imported cards
    let importedContainer = document.getElementById('imported-templates')
    if (!importedContainer) {
      importedContainer = document.createElement('section')
      importedContainer.id = 'imported-templates'
      importedContainer.className = 'templates-grid'
      grid.parentElement.appendChild(importedContainer)
    }

    // Render cards
    importedContainer.innerHTML = ''
    for (const rec of records) {
      const card = document.createElement('article')
      card.className = 'template-card'
      card.innerHTML = `
        <h2>${rec.name}</h2>
        <div class="template-preview" style="display:flex;align-items:center;justify-content:center">
          <span style="font-size:12px;color:#64748b">Imported template</span>
        </div>
        <button class="template-btn">Open</button>
      `
      importedContainer.appendChild(card)
    }
  }

  async function gatherTemplateItems(cards) {
    const items = []
    for (const card of cards) {
      const name = card.querySelector('h2')?.textContent?.trim() || 'Template'
      const href = card.getAttribute('href') || card.querySelector('a.template-btn')?.getAttribute('href')
      let indexHtml = ''
      if (href) {
        try {
          const res = await fetch(href)
          indexHtml = await res.text()
        } catch (_) {}
      }
      items.push({ name, indexHtml, stylesCss: '', scriptJs: '', assets: [], dependencies: { external: [] } })
    }
    return items
  }

  function createExportModal() {
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'
    overlay.id = 'export-modal'
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="export-title">
        <div class="modal-header">
          <div class="modal-title" id="export-title">Export Templates</div>
          <button class="btn ghost" id="export-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="options-grid">
            <label>Compression
              <select id="export-compression">
                <option value="DEFLATE" selected>DEFLATE</option>
                <option value="STORE">STORE (no compression)</option>
              </select>
            </label>
            <label>Compression Level
              <select id="export-level">
                <option value="3">3</option>
                <option value="6" selected>6</option>
                <option value="9">9</option>
              </select>
            </label>
          </div>
          <div style="margin-top:12px">
            <div class="progress"><div class="bar" id="export-progress"></div></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn outline" id="export-cancel">Cancel</button>
          <button class="btn" id="export-confirm">Create Package</button>
        </div>
      </div>
    `
    document.body.appendChild(overlay)

    const close = () => overlay.classList.remove('active')
    overlay.querySelector('#export-close').onclick = close
    overlay.querySelector('#export-cancel').onclick = close

    let onConfirm = null
    overlay.querySelector('#export-confirm').addEventListener('click', async () => {
      if (!onConfirm) return
      const compression = overlay.querySelector('#export-compression').value
      const compressionLevel = Number(overlay.querySelector('#export-level').value)
      const bar = overlay.querySelector('#export-progress')
      bar.style.width = '0%'
      overlay.querySelector('#export-confirm').disabled = true
      overlay.querySelector('#export-cancel').disabled = true
      try {
        await onConfirm({ compression, compressionLevel }, (p) => { bar.style.width = `${Math.floor(p)}%` })
        close()
      } catch (e) {
        alert(String(e?.message || e))
      } finally {
        overlay.querySelector('#export-confirm').disabled = false
        overlay.querySelector('#export-cancel').disabled = false
        bar.style.width = '0%'
      }
    })

    window.openExportModal = function (handler) {
      onConfirm = handler
      overlay.classList.add('active')
    }
  }

  function createImportModal() {
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay'
    overlay.id = 'import-modal'
    overlay.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="import-title">
        <div class="modal-header">
          <div class="modal-title" id="import-title">Import Templates</div>
          <button class="btn ghost" id="import-close">✕</button>
        </div>
        <div class="modal-body">
          <div class="drop-zone" id="import-drop">
            <p class="hint">Drag and drop .animpack here</p>
            <p class="sub">or click to select</p>
            <input type="file" id="import-file" accept=".animpack" />
          </div>
          <div id="import-preview" style="margin-top:14px; display:none">
            <div class="preview-row">
              <img id="preview-thumb" class="preview-thumb" alt="preview" />
              <div class="preview-meta">
                <div><strong id="preview-name"></strong> <span id="preview-version" style="color:#94a3b8"></span></div>
                <div id="preview-desc" style="color:#94a3b8"></div>
                <div id="preview-tags" style="margin-top:4px;color:#94a3b8"></div>
              </div>
            </div>
          </div>
          <div id="conflict-box" class="conflict-box" style="margin-top:12px; display:none">
            <div style="font-weight:600; margin-bottom:8px">Conflict detected</div>
            <div class="conflict-options">
              <label><input type="radio" name="conflict" value="overwrite" checked /> Overwrite</label>
              <label><input type="radio" name="conflict" value="duplicate" /> Keep both (duplicate)</label>
              <label><input type="radio" name="conflict" value="skip" /> Skip</label>
            </div>
          </div>
          <div style="margin-top:12px">
            <div class="progress"><div class="bar" id="import-progress"></div></div>
            <div id="import-status" style="margin-top:8px;color:#94a3b8"></div>
            <div id="import-error" style="margin-top:8px;color:#ef4444"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn outline" id="import-cancel">Cancel</button>
          <button class="btn" id="import-confirm" disabled>Import</button>
        </div>
      </div>
    `
    document.body.appendChild(overlay)

    const fileInput = overlay.querySelector('#import-file')
    const drop = overlay.querySelector('#import-drop')
    const confirmBtn = overlay.querySelector('#import-confirm')
    const progressBar = overlay.querySelector('#import-progress')
    const statusEl = overlay.querySelector('#import-status')
    const errorEl = overlay.querySelector('#import-error')
    const previewEl = overlay.querySelector('#import-preview')

    const importer = new TemplateImporter()

    const close = () => overlay.classList.remove('active')
    overlay.querySelector('#import-close').onclick = close
    overlay.querySelector('#import-cancel').onclick = close

    function resetState() {
      fileInput.value = ''
      progressBar.style.width = '0%'
      statusEl.textContent = ''
      errorEl.textContent = ''
      previewEl.style.display = 'none'
      confirmBtn.disabled = true
      overlay.querySelector('#conflict-box').style.display = 'none'
    }

    function setStatus(text) { statusEl.textContent = text }
    function setError(text) { errorEl.textContent = text }

    function readConflictChoice() {
      const val = overlay.querySelector('input[name="conflict"]:checked')?.value || 'overwrite'
      return val
    }

    async function pickConflictResolution(name) {
      overlay.querySelector('#conflict-box').style.display = 'block'
      return readConflictChoice()
    }

    function showPreview(manifest) {
      previewEl.style.display = 'block'
      overlay.querySelector('#preview-name').textContent = manifest.name || 'Template'
      overlay.querySelector('#preview-version').textContent = manifest.version ? `v${manifest.version}` : ''
      overlay.querySelector('#preview-desc').textContent = manifest.description || ''
      overlay.querySelector('#preview-tags').textContent = Array.isArray(manifest.tags) ? manifest.tags.join(', ') : ''
      if (manifest.preview && manifest.assets?.includes(manifest.preview)) {
        // best-effort load preview
        // will be available only post unzip; skip image content preview here
      }
    }

    function wireDropZone() {
      drop.addEventListener('click', () => fileInput.click())
      drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('dragover') })
      drop.addEventListener('dragleave', () => drop.classList.remove('dragover'))
      drop.addEventListener('drop', async (e) => {
        e.preventDefault(); drop.classList.remove('dragover')
        if (!e.dataTransfer.files.length) return
        await onFilePicked(e.dataTransfer.files[0])
      })
      fileInput.addEventListener('change', async (e) => {
        if (!fileInput.files.length) return; await onFilePicked(fileInput.files[0])
      })
    }

    async function onFilePicked(file) {
      resetState()
      if (!file.name.endsWith(PACKAGE_EXT)) { setError('Please select a .animpack file'); return }
      setStatus('Validating package...')
      try {
        const arrayBuffer = await file.arrayBuffer()
        const zip = await JSZip.loadAsync(arrayBuffer)
        const validation = await importer.validatePackage(zip)
        if (!validation.valid) {
          setError(`Invalid: ${validation.errors.join('; ')}`)
          return
        }
        showPreview(validation.manifest)
        confirmBtn.disabled = false
        overlay._selectedFile = file
        setStatus('Ready to import')
      } catch (e) {
        setError('Failed to read ZIP. The file may be corrupted.')
      }
    }

    wireDropZone()

    let onConfirmHandler = null

    confirmBtn.addEventListener('click', async () => {
      const file = overlay._selectedFile
      if (!file || !onConfirmHandler) return
      confirmBtn.disabled = true
      setStatus('Installing...')
      try {
        await onConfirmHandler(file, {
          setStatus,
          setError,
          pickConflictResolution,
        })
        close()
      } finally {
        confirmBtn.disabled = false
      }
    })

    window.openImportModal = function (handler) {
      resetState()
      overlay.classList.add('active')
      onConfirmHandler = handler
    }
  }

  // Expose classes
  window.TemplatePackager = TemplatePackager
  window.TemplateImporter = TemplateImporter

  // Initialize on templates page
  document.addEventListener('DOMContentLoaded', () => {
    const onTemplatesPage = !!document.querySelector('.templates-grid')
    if (!onTemplatesPage) return

    // Load JSZip
    if (!window.JSZip) {
      const s = document.createElement('script')
      s.src = 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js'
      document.head.appendChild(s)
      s.onload = () => initTemplateManagerUI()
      s.onerror = () => console.error('Failed to load JSZip')
    } else {
      initTemplateManagerUI()
    }
  })
})()