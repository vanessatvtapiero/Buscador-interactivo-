 export default  function TaskItem({ tarea, onEdit, onDelete, onToggleComplete }) {
  return (
    <motion.div
      className={`p-4 rounded-lg border transition-all duration-300 ${
        tarea.completada
          ? 'bg-green-50 border-green-200'
          : 'bg-white border-gray-200 hover:shadow-md'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      layout
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <input
            type="checkbox"
            checked={tarea.completada}
            onChange={() => onToggleComplete(tarea.id)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <span
            className={`flex-1 ${
              tarea.completada
                ? 'line-through text-gray-500'
                : 'text-gray-800'
            }`}
          >
            {tarea.tarea}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(tarea.id)}
            className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded text-sm transition-colors duration-200"
            disabled={tarea.completada}
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(tarea.id)}
            className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm transition-colors duration-200"
          >
            Eliminar
          </button>
        </div>
      </div>
    </motion.div>
  )
}