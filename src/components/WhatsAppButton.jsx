import { ChatIcon } from './Icons'
import { waLink } from '../utils/combos'
import { useSettings } from '../hooks/useSettings'

export default function WhatsAppButton({ href }) {
  const { settings } = useSettings()

  return (
    <a
      href={href || waLink(settings.waMsg, settings.whatsapp)}
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
