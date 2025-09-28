 export default function TaskForm({ onSubmit, taskValue, onChange, isEditing }) {
  return (
    <form onSubmit={onSubmit} className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={taskValue}
          onChange={onChange}
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ingresa una nueva tarea..."
          required
        />
        <button
          type="submit"
          className={`px-6 py-3 rounded-lg text-white font-semibold transition-all duration-200 ${
            isEditing 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isEditing ? 'Actualizar' : 'Agregar'}
        </button>
      </div>
    </form>
  )
}
 