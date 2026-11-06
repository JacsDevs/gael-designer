import { getComboMedia } from './comboMedia'
import { DEFAULT_SETTINGS } from '../services/siteService'

// "(91) 99915-1500" -> "5591999151500"
export function phoneDigits(phone = DEFAULT_SETTINGS.whatsapp) {
  const d = String(phone).replace(/\D/g, '')
  return d.length <= 11 ? `55${d}` : d
}

export function waLink(message, phone) {
  return `https://wa.me/${phoneDigits(phone)}?text=${encodeURIComponent(message)}`
}

export function instagramUrl(handle = DEFAULT_SETTINGS.instagram) {
  return `https://www.instagram.com/${String(handle).replace(/^@/, '').trim()}/`
}

// "R$ 300" | "300" | "R$ 1.200,00" -> 300 | 1200
export function parsePrice(price = '') {
  const digits = String(price).replace(/[^\d,]/g, '').split(',')[0]
  const value = parseInt(digits, 10)
  return Number.isNaN(value) ? null : value
}

export const COMBO_KEYS = [
  { id: 'logo', label: 'Logo', re: /logo|identidade|marca d/i },
  { id: 'camisa', label: 'Camisa', re: /camisa/i },
  { id: 'abada', label: 'Abadá', re: /abad[aá]|regata/i },
  { id: 'flyer', label: 'Flyer', re: /flyer/i },
  { id: 'video', label: 'Vídeo', re: /v[ií]deo/i },
]

export function inferKeys(text) {
  return COMBO_KEYS.filter(k => k.re.test(text)).map(k => k.id)
}

export function padNumber(n) {
  const d = String(n ?? '').replace(/\D/g, '')
  return d ? d.padStart(2, '0') : ''
}

export function comboTitle(n, name) {
  return `COMBO ${padNumber(n)} – ${name}`.trim()
}

// "COMBO 04 – Camisa + Identidade" -> { n: '04', name: 'Camisa + Identidade' }
export function splitTitle(title = '') {
  const match = title.match(/combo\s*0*(\d+)\s*[–—-]?\s*(.*)$/i)
  return {
    n: match ? match[1].padStart(2, '0') : '',
    name: (match && match[2].trim()) || title,
  }
}

// Mensagem salva (campo novo) ou extraída do link antigo "https://wa.me/...?text=...".
export function whatsappMessage(pkg) {
  if (pkg.whatsappMessage != null) return pkg.whatsappMessage
  const raw = (pkg.whatsappLink || '').split('?text=')[1] || ''
  try { return decodeURIComponent(raw) } catch { return raw }
}

export function comboItems(pkg) {
  if (Array.isArray(pkg.items) && pkg.items.length) return pkg.items
  return (pkg.subtitle || '').split('+').map(s => s.trim()).filter(Boolean)
}

// Normaliza um documento de "packages" do Firestore para o formato do site.
export function toCombo(pkg, settings = DEFAULT_SETTINGS) {
  const { n, name } = splitTitle(pkg.title)
  const items = comboItems(pkg)
  const price = parsePrice(pkg.price)
  const keys = Array.isArray(pkg.keys) ? pkg.keys : inferKeys(`${pkg.title || ''} ${pkg.subtitle || ''}`)
  const media = getComboMedia(pkg)
  const cover = media.find(m => m.type === 'image') || media[0] || null
  const message = whatsappMessage(pkg) ||
    `Olá, Gael! Vi no site e quero o COMBO ${n} – ${name}${price ? ` (R$ ${price})` : ''}. É para: [nome do grupo, empresa ou evento].`

  return {
    id: pkg.id,
    n,
    name,
    items,
    price,
    description: pkg.description || '',
    keys,
    media,
    cover,
    // undefined = combo antigo sem selo definido no painel (recebe selo automático)
    manualTag: pkg.tag,
    active: pkg.active !== false,
    wa: waLink(message, settings.whatsapp),
  }
}

// Combos sem selo definido no painel ganham "Mais em conta" / "Mais completo" automáticos.
export function withTags(combos) {
  const priced = combos.filter(c => c.price != null)
  const min = priced.length > 1 ? Math.min(...priced.map(c => c.price)) : null
  const max = priced.length > 1 ? Math.max(...priced.map(c => c.price)) : null
  const cheapest = priced.find(c => c.price === min)
  const fullest = priced
    .filter(c => c.price === max)
    .sort((a, b) => b.items.length - a.items.length)[0]

  return combos.map(c => {
    if (c.manualTag !== undefined) return { ...c, tag: c.manualTag }
    const tag = c === cheapest ? 'Mais em conta' : c === fullest ? 'Mais completo' : ''
    return { ...c, tag }
  })
}
