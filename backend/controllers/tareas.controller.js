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
  const { id } = req.params;
  const { tarea, fecha, completada, userId } = req.body;

  console.log('Datos recibidos para actualizar:', {
    id,
    tarea,
    fecha,
    completada,
    userId
  });

  try {
    // Verificar que la tarea exista
    const [tareaExistente] = await db.query("SELECT * FROM tareas WHERE id = ?", [id]);
    
    if (!tareaExistente || tareaExistente.length === 0) {
      console.log('Tarea no encontrada');
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    // Verificar que el usuario sea el propietario
    if (tareaExistente[0].userId != userId) {
      console.log('Usuario no autorizado');
      return res.status(403).json({ error: "No autorizado para modificar esta tarea" });
    }

    // Actualizar la tarea
    const [result] = await db.query(
      `UPDATE tareas 
       SET tarea = COALESCE(?, tarea),
           fecha = COALESCE(?, fecha),
           completada = COALESCE(?, completada)
       WHERE id = ? AND userId = ?`,
      [tarea, fecha, completada, id, userId]
    );

    console.log('Resultado de la actualización:', result);

    if (result.affectedRows === 0) {
      return res.status(400).json({ error: "No se pudo actualizar la tarea" });
    }

    // Obtener la tarea actualizada
    const [tareaActualizada] = await db.query("SELECT * FROM tareas WHERE id = ?", [id]);
    
    if (!tareaActualizada || tareaActualizada.length === 0) {
      return res.status(404).json({ error: "No se pudo obtener la tarea actualizada" });
    }

    console.log('Tarea actualizada:', tareaActualizada[0]);
    res.json(tareaActualizada[0]);

  } catch (error) {
    console.error("Error al actualizar tarea:", error);
    res.status(500).json({ 
      error: "Error al actualizar la tarea",
      details: error.message
    });
  }
}

export async function eliminarTarea(req, res) {
  const { id } = req.params;
  await db.query("DELETE FROM tareas WHERE id = ?", [id]);
  res.json({ message: "Tarea eliminada" });
}
