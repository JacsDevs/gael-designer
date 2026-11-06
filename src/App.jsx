// HashRouter: o GitHub Pages não reescreve rotas, então elas ficam depois do "#".
import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ComboDetails from './pages/ComboDetails'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AdminRoute from './admin/AdminRoute'
import SettingsProvider from './context/SettingsProvider'

function App() {
  return (
    <SettingsProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/combo/:id" element={<ComboDetails />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </HashRouter>
    </SettingsProvider>
  )
}

export default App
