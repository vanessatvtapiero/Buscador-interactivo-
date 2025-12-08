import { useState, useEffect, useCallback } from 'react'
import SearchInput from './SearchInput'
import UserCard from './UserCard'
import UserModal from './userModal'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { CircularProgress } from '@mui/material'
import 'react-toastify/dist/ReactToastify.css'  

 export default function AdminView() {
  const [usuarios, setUsuarios] = useState([])
  const [filtrados, setFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [buscando, setBuscando] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null)
  const { logout } = useAuth()

useEffect(() => {
  Promise.all([
    fetch('http://localhost:3001/usuarios').then(res => res.json()),
    fetch('http://localhost:3001/tareas').then(res => res.json())
  ]).then(([usuariosData, tareasData]) => {
    const usuariosConTareas = usuariosData.map(usuario => ({
      ...usuario,
      tareas: tareasData.filter(tarea => tarea.userId === usuario.id)
    }))
    setUsuarios(usuariosConTareas)
    setFiltrados(usuariosConTareas)
    setLoading(false)
  })
}, [])



  const filtrarUsuarios = useCallback(
    (query) => {
      setBuscando(true)
      setTimeout(() => {
        const q = query.trim().toLowerCase()
        const resultados = usuarios.filter((usuario) =>
          [
            usuario.nombre,
            usuario.apellidos,
            usuario.intereses,
            usuario.perfil,
            usuario.correo,
          ].some((campo) => String(campo).toLowerCase().includes(q))
        )

        setFiltrados(resultados)
        setBuscando(false)
      }, 500)
    },
    [usuarios]
  )

  const abrirModal = (usuario) => {
    setUsuarioSeleccionado(usuario)
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setUsuarioSeleccionado(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Panel de Administrador
          </h1>
          <button 
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            onClick={logout}
          >
            Cerrar Sesión
          </button>
        </div>
        
        <div className="max-w-md mx-auto mb-8">
          <SearchInput onSearch={filtrarUsuarios} />
        </div>

        {loading && (
          <div className="flex justify-center items-center my-20">
            <CircularProgress size={60} />
          </div>
        )}

        {buscando && (
          <div className="flex justify-center items-center my-20">
            <CircularProgress color="primary" size={60} />
          </div>
        )}

        {!buscando && !loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.isArray(filtrados) &&
              filtrados.map((usuario) => (
                <UserCard
                  key={usuario.id}
                  usuario={usuario}
                  onClick={() => abrirModal(usuario)}
                />
              ))}
          </div>
        )}

        {!buscando && !loading && filtrados.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No se encontraron usuarios</p>
          </div>
        )}

        <UserModal
          isOpen={modalAbierto}
          onClose={cerrarModal}
          usuario={usuarioSeleccionado}
        />
      </div>
    </div>
  )
}