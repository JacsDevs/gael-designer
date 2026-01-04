import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ComboDetails from './pages/ComboDetails'
import AdminLogin from './admin/AdminLogin'
import AdminDashboard from './admin/AdminDashboard'
import AdminRoute from './admin/AdminRoute'

function App() {
  return (
    <BrowserRouter basename="/gael-designer">
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
    </BrowserRouter>
  )
}

export default App
