import { motion } from 'framer-motion'

export default function UserModal({ isOpen, onClose, usuario }) {
  if (!isOpen || !usuario) return null

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

          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-gray-600 text-sm mb-6">
            <p><span className="font-semibold text-gray-800">Ocupación:</span> {usuario.ocupacion || 'N/A'}</p>
            <p><span className="font-semibold text-gray-800">Perfil:</span> {usuario.perfil || 'N/A'}</p>
            <p className="col-span-2"><span className="font-semibold text-gray-800">Correo:</span> {usuario.correo}</p>
            <p className="col-span-2"><span className="font-semibold text-gray-800">Intereses:</span> {usuario.intereses || 'N/A'}</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Tareas ({usuario.tareas ? usuario.tareas.length : 0})
            </h4>

            {usuario.tareas && usuario.tareas.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100">
                {usuario.tareas.map((tarea) => (
                  <div
                    key={tarea.id}
                    className={`p-3 rounded-md border flex justify-between items-center text-sm ${
                      tarea.completada
                        ? 'bg-green-50 border-green-200 text-green-800'
                        : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                    }`}
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
          </div>
        </div>
      </motion.div>
    </div>
  )
}
