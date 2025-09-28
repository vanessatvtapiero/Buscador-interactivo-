import { createContext, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const login = async (correo, password) => {
    try {
      // Buscar en json-server
      const res = await fetch(`http://localhost:3001/usuarios?correo=${correo}&password=${password}`)
      const data = await res.json()

      if (data.length > 0) {
        const loggedUser = data[0]
        setUser(loggedUser)

        if (loggedUser.rol === "admin") {
          toast.success("Login exitoso como Administrador!")
          navigate("/admin")   // 🔥 redirección a admin
        } else {
          toast.success("Login exitoso!")
          navigate("/usuarios") // 🔥 redirección a usuarios
        }

        return loggedUser
      } else {
        toast.error("Credenciales incorrectas")
        return null
      }
    } catch (error) {
      console.error("Error en login:", error)
      toast.error("Error al iniciar sesión")
      return null
    }
  }

  const logout = () => {
    setUser(null)
    toast.info('Sesión cerrada')
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
