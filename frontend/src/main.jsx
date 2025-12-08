import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import UserView from './components/UserView'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/usuarios"
          element={
            <PrivateRoute>
              <UserView />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  </BrowserRouter>
)
