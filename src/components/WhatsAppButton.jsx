import { ChatIcon } from './Icons'
import { waLink } from '../utils/combos'

export default function WhatsAppButton({ href }) {
  return (
    <a
      href={href || waLink('Olá, Gael! Vim pelo site e quero um orçamento.')}
      className="whatsapp-float"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o Gael no WhatsApp"
    >
      <ChatIcon />
      WhatsApp
    </a>
  )
}
