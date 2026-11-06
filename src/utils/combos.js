import { getComboMedia } from './comboMedia'

export const WHATSAPP_NUMBER = '5591999151500'

export function waLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

// "R$ 300" | "300" | "R$ 1.200,00" -> 300 | 1200
export function parsePrice(price = '') {
  const digits = String(price).replace(/[^\d,]/g, '').split(',')[0]
  const value = parseInt(digits, 10)
  return Number.isNaN(value) ? null : value
}

const KEYWORDS = {
  logo: /logo|identidade|marca d/i,
  camisa: /camisa/i,
  abada: /abad[aá]|regata/i,
  flyer: /flyer/i,
  video: /v[ií]deo/i,
}

// Normaliza um documento de "packages" do Firestore para o formato do design.
export function toCombo(pkg) {
  const title = pkg.title || ''
  const match = title.match(/combo\s*0*(\d+)\s*[–—-]?\s*(.*)$/i)
  const n = match ? match[1].padStart(2, '0') : ''
  const name = (match && match[2].trim()) || title
  const items = (pkg.subtitle || '')
    .split('+')
    .map(s => s.trim())
    .filter(Boolean)
  const price = parsePrice(pkg.price)
  const searchText = `${title} ${pkg.subtitle || ''}`
  const keys = Object.keys(KEYWORDS).filter(k => KEYWORDS[k].test(searchText))
  const media = getComboMedia(pkg)
  const cover = media.find(m => m.type === 'image') || media[0] || null

  const fallbackWa = waLink(
    `Olá, Gael! Vi no site e quero o COMBO ${n} – ${name}${price ? ` (R$ ${price})` : ''}. É para: [nome do grupo, empresa ou evento].`
  )

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
    wa: pkg.whatsappLink || fallbackWa,
  }
}

// Marca o combo mais barato e o mais caro (com mais itens) com uma etiqueta.
export function withTags(combos) {
  const priced = combos.filter(c => c.price != null)
  if (priced.length < 2) return combos
  const min = Math.min(...priced.map(c => c.price))
  const max = Math.max(...priced.map(c => c.price))
  const cheapest = priced.find(c => c.price === min)
  const fullest = priced
    .filter(c => c.price === max)
    .sort((a, b) => b.items.length - a.items.length)[0]
  return combos.map(c => ({
    ...c,
    tag: c === cheapest ? 'Mais em conta' : c === fullest ? 'Mais completo' : '',
  }))
}
