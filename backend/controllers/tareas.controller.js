import { db } from "../database/db.js";

export async function getTareas(req, res) {
  const { userId } = req.params;
  const [rows] = await db.query("SELECT * FROM tareas WHERE userId=?", [userId]);
  res.json(rows);
}

// Modificar la función crearTarea
export async function crearTarea(req, res) {
  const { tarea, fecha, userId } = req.body;
  try {
    const [result] = await db.query(
      "INSERT INTO tareas (tarea, fecha, userId) VALUES (?, ?, ?)",
      [tarea, fecha, userId]
    );
    
    const nuevaTarea = {
      id: result.insertId,
      tarea,
      fecha,
      userId,
      completada: false
    };
    res.status(201).json(nuevaTarea);
  } catch (error) {
    console.error("Error al crear tarea:", error);
    res.status(500).json({ error: "Error al crear la tarea" });
  }
}

// En tareas.controller.js
export async function actualizarTarea(req, res) {
  console.log('=== INICIO actualizarTarea ===');
  console.log('Params:', req.params);
  console.log('Body:', req.body);
  
  const { id } = req.params;
  const { tarea, fecha, completada, userId } = req.body;

  // Validar que el ID sea un número
  if (isNaN(Number(id))) {
    return res.status(400).json({ 
      error: "ID de tarea no válido",
      id: id
    });
  }

  // Validar que se proporcione al menos un campo para actualizar
  if (tarea === undefined && fecha === undefined && completada === undefined) {
    return res.status(400).json({ 
      error: "Debe proporcionar al menos un campo para actualizar",
      campos: { tarea, fecha, completada }
    });
  }

  // Validar que el userId sea proporcionado
  if (!userId) {
    return res.status(400).json({ 
      error: "Se requiere el ID de usuario (userId)"
    });
  }

  try {
    // Verificar que la tarea exista
    console.log('Buscando tarea con id:', id);
    const [tareaExistente] = await db.query("SELECT * FROM tareas WHERE id = ?", [id]);
    
    if (!tareaExistente || tareaExistente.length === 0) {
      return res.status(404).json({ 
        error: "Tarea no encontrada",
        id: id
      });
    }

    // Verificar que el usuario sea el propietario
    if (parseInt(tareaExistente[0].userId) !== parseInt(userId)) {
      return res.status(403).json({ 
        error: "No autorizado para modificar esta tarea",
        userIdTarea: tareaExistente[0].userId,
        userIdSolicitud: userId
      });
    }

    // Construir la consulta SQL dinámicamente
    const updates = [];
    const values = [];
    
    if (tarea !== undefined) {
      updates.push('tarea = ?');
      values.push(tarea);
    }
    
    if (fecha !== undefined) {
      updates.push('fecha = ?');
      values.push(fecha);
    }
    
    if (completada !== undefined) {
      updates.push('completada = ?');
      values.push(completada);
    }
    
    // Agregar el WHERE
    values.push(id, userId);
    
    const query = `UPDATE tareas 
                  SET ${updates.join(', ')}
                  WHERE id = ? AND userId = ?`;
    
    console.log('Ejecutando consulta SQL:', query);
    console.log('Valores:', values);
    
    // Actualizar la tarea
    const [result] = await db.query(query, values);
    
    if (result.affectedRows === 0) {
      return res.status(400).json({ 
        error: "No se pudo actualizar la tarea",
        posibleCausa: "La tarea existe pero no pertenece al usuario especificado"
      });
    }

    // Obtener la tarea actualizada
    const [tareaActualizada] = await db.query("SELECT * FROM tareas WHERE id = ?", [id]);
    
    if (!tareaActualizada || tareaActualizada.length === 0) {
      return res.status(404).json({ 
        error: "No se pudo obtener la tarea actualizada",
        id: id
      });
    }

    console.log('Tarea actualizada correctamente:', tareaActualizada[0]);
    console.log('=== FIN actualizarTarea ===');
    return res.json({
      success: true,
      data: tareaActualizada[0],
      message: "Tarea actualizada correctamente"
    });

  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    return res.status(500).json({ 
      error: "Error interno del servidor al actualizar la tarea",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

export async function eliminarTarea(req, res) {
  const { id } = req.params;
  await db.query("DELETE FROM tareas WHERE id = ?", [id]);
  res.json({ message: "Tarea eliminada" });
}
