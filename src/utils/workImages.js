// Imagens dos "Trabalhos selecionados" ficam no repositório, em src/assets/trabalhos/.
// No painel, cada trabalho guarda só o nome do arquivo (ex.: "anarrie-camisa.webp").
const files = import.meta.glob(
  '../assets/trabalhos/*.{webp,jpg,jpeg,png}',
  { eager: true, query: '?url', import: 'default' }
)

const byName = {}
for (const [path, url] of Object.entries(files)) {
  byName[path.split('/').pop()] = url
}

export const WORK_IMAGE_NAMES = Object.keys(byName).sort((a, b) => a.localeCompare(b))

export function getWorkImage(name) {
  return (name && byName[name]) || null
}
