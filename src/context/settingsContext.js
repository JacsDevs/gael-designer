import { createContext } from 'react'
import { DEFAULT_SETTINGS } from '../services/siteService'

export const SettingsContext = createContext({
  settings: DEFAULT_SETTINGS,
  setSettings: () => {},
})
