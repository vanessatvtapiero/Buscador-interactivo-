import { createContext, useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Modificar el estado inicial
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const navigate = useNavigate();

  // Modificar la función login
  const login = async (correo, password) => {
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password })
      });

      const data = await res.json();

      if (data.length > 0) {
        const loggedUser = data[0];
        setUser(loggedUser);
        localStorage.setItem('user', JSON.stringify(loggedUser));

        if (loggedUser.rol === "admin") {
          toast.success("¡Bienvenido Administrador!");
          navigate("/admin");
        } else {
          toast.success("¡Inicio de sesión exitoso!");
          navigate("/usuarios");
        }
        return loggedUser;
      } else {
        toast.error("Credenciales incorrectas");
        return null;
      }
    } catch (error) {
      console.error("Error en login:", error);
      toast.error("Error al iniciar sesión");
      return null;
    }
  };

  // Modificar la función logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Sesión cerrada');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
