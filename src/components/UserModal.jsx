import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function UserModal({ isOpen, onClose, usuario, onUpdate }) {
  if (!isOpen || !usuario) return null

  const [tareas, setTareas] = useState(usuario.tareas || [])
  const [nuevaTarea, setNuevaTarea] = useState("")

  useEffect(() => {
    setTareas(usuario.tareas || [])
  }, [usuario])

  // 🔄 Notificar cambios al AdminView
const syncUpdate = async () => {
  try {
    const res = await fetch(`http://localhost:3001/tareas?userId=${usuario.id}`)
    const tareasActualizadas = await res.json()
    setTareas(tareasActualizadas)
    onUpdate?.({ ...usuario, tareas: tareasActualizadas })
  } catch (err) {
    console.error("❌ Error sincronizando:", err)
  }
}


  // ✅ Cambiar estado de tarea y guardar en backend
  const toggleTarea = async (id) => {
    const tarea = tareas.find((t) => t.id === id)
    if (!tarea) return

    const actualizada = { ...tarea, completada: !tarea.completada }

    try {
      await fetch(`http://localhost:3001/tareas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actualizada)
      })
      const nuevas = tareas.map((t) => (t.id === id ? actualizada : t))
      syncUpdate(nuevas)
    } catch (err) {
      console.error("❌ Error al actualizar tarea:", err)
    }
  }

  // ✅ Añadir nueva tarea en backend
  const addTarea = async () => {
    if (!nuevaTarea.trim()) return
    const nueva = {
      id: Date.now(),
      userId: usuario.id, // 👈 para relacionar la tarea con el usuario
      tarea: nuevaTarea,
      completada: false
    }

    try {
      await fetch("http://localhost:3001/tareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nueva)
      })
      const nuevas = [...tareas, nueva]
      syncUpdate(nuevas)
      setNuevaTarea("")
    } catch (err) {
      console.error("❌ Error al crear tarea:", err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-xl max-w-xl w-full max-h-[70vh] overflow-hidden shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-3">
          <h2 className="text-xl font-semibold text-gray-900">Detalles del Usuario</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="text-gray-400 hover:text-gray-700 transition-colors duration-150 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(70vh-56px)]">
          {/* Info del usuario */}
          <div className="flex flex-col items-center mb-6">
            <img
              className="w-24 h-24 rounded-full border-4 border-blue-300 object-cover mb-3"
              src={usuario.foto}
              alt={`${usuario.nombre} ${usuario.apellidos}`}
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${usuario.nombre}+${usuario.apellidos}&background=6366f1&color=fff&size=200`
              }}
            />
            <h3 className="text-lg font-bold text-gray-800">
              {usuario.nombre} {usuario.apellidos}
            </h3>
          </div>

          {/* Info extra */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-600 text-sm mb-6">
            <p><span className="font-semibold text-gray-800">Ocupación:</span> {usuario.ocupacion || 'N/A'}</p>
            <p><span className="font-semibold text-gray-800">Perfil:</span> {usuario.perfil || 'N/A'}</p>
            <p className="col-span-2"><span className="font-semibold text-gray-800">Correo:</span> {usuario.correo}</p>
            <p className="col-span-2"><span className="font-semibold text-gray-800">Intereses:</span> {usuario.intereses || 'N/A'}</p>
          </div>

          {/* Tareas */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Tareas ({tareas.length})
            </h4>

            {tareas.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
                {tareas.map((tarea) => (
                  <div
                    key={tarea.id}
                    className={`p-3 rounded-md border flex justify-between items-center text-sm cursor-pointer ${
                      tarea.completada
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    }`}
                    onClick={() => toggleTarea(tarea.id)}
                  >
                    <span className={tarea.completada ? 'line-through' : ''}>
                      {tarea.tarea}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold select-none">
                      {tarea.completada ? 'Completada' : 'Pendiente'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 italic">Este usuario no tiene tareas asignadas</p>
            )}

            {/* Form para añadir nueva tarea */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={nuevaTarea}
                onChange={(e) => setNuevaTarea(e.target.value)}
                placeholder="Nueva tarea..."
                className="flex-1 border rounded-md px-3 py-2 text-sm focus:ring focus:ring-blue-300"
              />
              <button
                onClick={addTarea}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
