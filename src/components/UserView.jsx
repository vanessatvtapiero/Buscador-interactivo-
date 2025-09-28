import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEffect} from 'react';

export default function UserView() {
  const [tarea, setTarea] = useState('');
  const [tareas, setTareas] = useState([]);
  const [editando, setEditando] = useState(null);
  const { logout, user } = useAuth();

  const handleChange = (e) => setTarea(e.target.value);

  const borrarTarea = (id) => {
    setTareas(tareas.filter(t => t.id !== id));
  };

  const editarTarea = (id) => {
    const tareaAEditar = tareas.find(t => t.id === id);
    setTarea(tareaAEditar.tarea);
    setEditando(id);
  };

  const toggleComplete = (id) => {
    setTareas(tareas.map(t =>
      t.id === id ? { ...t, completada: !t.completada } : t
    ));
  };

  const tareasCompletadas = tareas.filter(t => t.completada).length;
  const tareasPendientes = tareas.filter(t => !t.completada).length;
  
useEffect(() => {
  if (!user) return;

  fetch("http://localhost:3001/tareas")
    .then(res => res.json())
    .then(data => {
      if (user.role === "admin") {
        setTareas(data); 
      } else {
        setTareas(data.filter(t => t.userId === user.id)); 
      }
    });
}, [user]);

const addTask = async (e) => {
  e.preventDefault();
  if (tarea.trim() === '') return;

  const nuevaTarea = {
    id: Date.now(),
    tarea,
    completada: false,
    fecha: new Date().toISOString().split('T')[0],
    userId: user?.id
  };

  await fetch("http://localhost:3001/tareas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevaTarea)
  });

  setTareas([nuevaTarea, ...tareas]);
  setTarea('');
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              ¡Hola, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-2">Gestiona tus tareas diarias</p>
          </div>
          <button 
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            onClick={logout}
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total</h3>
            <p className="text-3xl font-bold text-blue-600">{tareas.length}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Completadas</h3>
            <p className="text-3xl font-bold text-green-600">{tareasCompletadas}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pendientes</h3>
            <p className="text-3xl font-bold text-orange-600">{tareasPendientes}</p>
          </div>
        </div>

        {/* Formulario de tareas */}
        <form onSubmit={addTask} className="flex gap-4 mb-6">
          <input 
            type="text"
            value={tarea}
            onChange={handleChange}
            placeholder="Escribe una tarea..."
            className="flex-1 border px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button 
            type="submit"
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            {editando ? 'Actualizar' : 'Agregar'}
          </button>
        </form>

        {/* Lista de tareas */}
        {tareas.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl">No tienes tareas pendientes</p>
            <p className="text-sm mt-2">¡Agrega tu primera tarea para comenzar!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tareas.map((tareaItem) => (
              <div 
                key={tareaItem.id} 
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md"
              >
                <div>
                  <p className={`text-lg ${tareaItem.completada ? 'line-through text-gray-400' : ''}`}>
                    {tareaItem.tarea}
                  </p>
                  <span className="text-sm text-gray-500">{tareaItem.fecha}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleComplete(tareaItem.id)}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                  >
                    {tareaItem.completada ? 'Desmarcar' : 'Completar'}
                  </button>
                  <button 
                    onClick={() => editarTarea(tareaItem.id)}
                    className="px-3 py-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded"
                  >
                    Editar
                  </button>
                  <button 
                    onClick={() => borrarTarea(tareaItem.id)}
                    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded"
                  >
                    Borrar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

}
