import { useEffect, useState } from 'react'
import { SettingsContext } from './settingsContext'
import { DEFAULT_SETTINGS, getSettings } from '../services/siteService'

// Carrega site/settings uma vez. Até chegar, o site usa os valores padrão.
export default function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)

  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch(error => console.error('Erro ao carregar configurações:', error))
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}
