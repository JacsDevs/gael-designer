// 1. Troque o BrowserRouter por HashRouter na importação
import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ComboDetails from './pages/ComboDetails'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AdminRoute from './admin/AdminRoute'

function App() {
  return (
    // 2. Use o HashRouter (não precisa mais do basename="/gael-designer")
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
  )
}

export default App