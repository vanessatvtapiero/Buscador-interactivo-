import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function UserView() {
  const [tarea, setTarea] = useState('');
  const [tareas, setTareas] = useState([]);
  const [editando, setEditando] = useState(null);
  const { logout, user } = useAuth();

  const handleChange = (e) => setTarea(e.target.value);

  const borrarTarea = async (id) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      await fetch(`${apiUrl}/tareas/${id}`, {
        method: 'DELETE',
      });
      setTareas(tareas.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
    }
  };

  const editarTarea = (id) => {
  const tareaAEditar = tareas.find(t => t.id === id);
  if (tareaAEditar) {
    setTarea(tareaAEditar.tarea);
    setEditando(id);
  }
};

const toggleComplete = async (id) => {
  try {
    const tareaActualizar = tareas.find(t => t.id === id);
    if (!tareaActualizar) {
      console.error('No se encontró la tarea con id:', id);
      return;
    }
    
    const tareaActualizada = { 
      ...tareaActualizar, 
      completada: !tareaActualizar.completada 
    };

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    const response = await fetch(`${apiUrl}/tareas/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        tarea: tareaActualizar.tarea,
        fecha: tareaActualizar.fecha,
        completada: tareaActualizada.completada,
        userId: user?.id // Asegúrate de que user no sea null/undefined
      })
    });

    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('Error en la respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        error: responseData
      });
      throw new Error(responseData.error || 'Error al actualizar la tarea');
    }

    // Actualizar el estado local con los datos del servidor
    setTareas(tareas.map(t => 
      t.id === id ? { ...t, ...responseData.data, completada: tareaActualizada.completada } : t
    ));

  } catch (error) {
    console.error('Error en toggleComplete:', error);
    // Aquí podrías mostrar un mensaje de error al usuario
  }
};

  const tareasCompletadas = tareas.filter(t => t.completada).length;
  const tareasPendientes = tareas.filter(t => !t.completada).length;

  useEffect(() => {
    if (!user || !user.id) return;

    const fetchTareas = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await fetch(`${apiUrl}/tareas/${user.id}`);
        if (!response.ok) {
          throw new Error('Error al cargar las tareas');
        }

        const data = await response.json();
        console.log('Tareas cargadas:', data);
        setTareas(data);
      } catch (error) {
        console.error('Error al cargar las tareas:', error);
      }
    };

    fetchTareas();
  }, [user]);

const addTask = async (e) => {
  e.preventDefault();
  if (tarea.trim() === '') return;

  const tareaText = tarea.trim();

  try {
    if (!user?.id) {
      console.error('Usuario no autenticado');
      return;
    }

    // Si estamos editando una tarea existente
    if (editando) {
      const tareaId = editando;
      const tareaActual = tareas.find(t => t.id === tareaId);
      
      if (!tareaActual) {
        console.error('Tarea no encontrada para editar');
        return;
      }

      console.log('Enviando actualización al servidor:', {
        id: tareaId,
        tarea: tareaText,
        userId: user.id
      });

      const apiUrl = import.meta.env.VITE_API_URL;
      const response = await fetch(`${apiUrl}/tareas/${tareaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tarea: tareaText,
          fecha: tareaActual.fecha,
          completada: tareaActual.completada,
          userId: user.id
        })
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error al actualizar: ${response.status} ${response.statusText}`);
      }

      const tareaActualizada = await response.json();
      
      // Actualizar el estado local
      setTareas(prevTareas => 
        prevTareas.map(t => 
          t.id === tareaId ? { ...t, tarea: tareaText } : t
        )
      );
      
      // Limpiar el formulario
      setEditando(null);
      setTarea('');
      return;
    }

    // Resto del código para crear una nueva tarea...
    const tareaTemporal = {
      id: Date.now(), // ID temporal
      tarea: tareaText,
      fecha: new Date().toISOString().split('T')[0],
      userId: user.id,
      completada: false
    };

    // Actualizar el estado local inmediatamente
    setTareas(prevTareas => [tareaTemporal, ...prevTareas]);
    setTarea('');

    // Enviar al servidor
    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/tareas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tarea: tareaText,
        fecha: tareaTemporal.fecha,
        userId: user.id
      })
    });

    if (!response.ok) {
      throw new Error('Error al crear la tarea');
    }

    const tareaCreada = await response.json();
    
    // Actualizar con los datos del servidor
    setTareas(prevTareas => 
      prevTareas.map(t => 
        t.id === tareaTemporal.id ? { ...t, ...tareaCreada } : t
      )
    );

  } catch (error) {
    console.error('Error al procesar la tarea:', error);
    alert(error.message || 'Error al procesar la tarea');
  }
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
{/* Lista de tareas */}
{tareas.length === 0 ? (
  <div className="text-center py-12 text-gray-500">
    <p className="text-xl">No tienes tareas pendientes</p>
    <p className="text-sm mt-2">¡Agrega tu primera tarea para comenzar!</p>
  </div>
) : (
  <div className="space-y-4">
    {tareas.map((tareaItem) => {
      // Función para formatear la fecha de manera segura
      const formatearFecha = (fecha) => {
        try {
          // Si la fecha es un string en formato YYYY-MM-DD
          if (typeof fecha === 'string' && fecha.includes('-')) {
            const [year, month, day] = fecha.split('-').map(Number);
            return new Date(year, month - 1, day).toLocaleDateString('es-ES');
          }
          // Si es un timestamp o ya es un objeto Date
          const fechaObj = new Date(fecha);
          if (isNaN(fechaObj.getTime())) {
            return 'Hoy';
          }
          return fechaObj.toLocaleDateString('es-ES');
        } catch (error) {
          console.error('Error formateando fecha:', error);
          return 'Hoy';
        }
      };

      return (
        <div
          key={`tarea-${tareaItem.id}`}
          className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md"
        >
          <div>
            <p className={`text-lg ${tareaItem.completada ? 'line-through text-gray-400' : ''}`}>
              {tareaItem.tarea}
            </p>
            <span className="text-sm text-gray-500">
              {formatearFecha(tareaItem.fecha)}
            </span>
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
      );
    })}
  </div>
)}
      </div>
    </div>
  );

}
