// Mídias dos combos ficam no repositório, em src/assets/combos/combo-XX/
// (XX = número do combo no título, ex: "COMBO 07 – ..." -> combo-07).
// A ordem de exibição segue o nome do arquivo (01.webp, 02.mp4, ...).
const files = import.meta.glob(
  '../assets/combos/*/*.{webp,jpg,jpeg,png,mp4,webm}',
  { eager: true, query: '?url', import: 'default' }
)

const mediaByFolder = {}

for (const [path, url] of Object.entries(files).sort(([a], [b]) => a.localeCompare(b))) {
  const [, folder, file] = path.match(/combos\/([^/]+)\/([^/]+)$/)
  const type = /\.(mp4|webm)$/i.test(file) ? 'video' : 'image'

  mediaByFolder[folder] ??= []
  mediaByFolder[folder].push({ id: `${folder}/${file}`, type, url })
}

export function getComboFolder(title = '') {
  const match = title.match(/combo\s*0*(\d+)/i)
  return match ? `combo-${match[1].padStart(2, '0')}` : null
}

export function getComboMedia(combo) {
  const folder = getComboFolder(combo?.title)
  return (folder && mediaByFolder[folder]) || []
}
