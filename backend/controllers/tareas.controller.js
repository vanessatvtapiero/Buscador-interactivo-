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
    // Formatear la fecha al formato YYYY-MM-DD que espera MySQL
    const fechaFormateada = fecha ? new Date(fecha).toISOString().split('T')[0] : null;
    
    const [result] = await db.query(
      "INSERT INTO tareas (tarea, fecha, userId) VALUES (?, ?, ?)",
      [tarea, fechaFormateada, userId]
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


  console.log('Datos recibidos para actualizar:', {
    id,
    tarea,
    fecha,
    completada,
    userId,
    tipos: {
      id: typeof id,
      tarea: typeof tarea,
      fecha: typeof fecha,
      completada: typeof completada,
      userId: typeof userId
    }
  });


  try {
    // Verificar que la tarea exista
    console.log('Buscando tarea con id:', id);
    const [tareaExistente] = await db.query("SELECT * FROM tareas WHERE id = ?", [id]);
    console.log('Tarea encontrada en la base de datos:', tareaExistente[0]);

    if (!tareaExistente || tareaExistente.length === 0) {
      console.log('ERROR: Tarea no encontrada en la base de datos');
      return res.status(404).json({
        error: "Tarea no encontrada",
        idBuscado: id,
        tareasEncontradas: tareaExistente
      });
    }


    // Verificar que el usuario sea el propietario
    console.log('Verificando propietario. UserId en tarea:', tareaExistente[0].userId, 'userId en solicitud:', userId);
    if (tareaExistente[0].userId != userId) {
      console.log('ERROR: Usuario no autorizado para modificar esta tarea');
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
      // Convertir la fecha al formato YYYY-MM-DD que espera MySQL
      const fechaObj = new Date(fecha);
      const fechaFormateada = fechaObj.toISOString().split('T')[0];
      values.push(fechaFormateada);
    }

    if (completada !== undefined) {
      updates.push('completada = ?');
      values.push(completada);
    }

    // Agregar el WHERE
    values.push(id, userId);

    // Reemplazar las líneas problemáticas (alrededor de la línea 110)
    const query = `UPDATE tareas 
               SET ${updates.join(', ')}
               WHERE id = ? AND userId = ?`;

    console.log('Ejecutando consulta SQL:', query);
    console.log('Valores:', values);

    // Actualizar la tarea
    const [result] = await db.query(query, values);
    console.log('Resultado de la actualización:', result);


    if (result.affectedRows === 0) {
      console.log('ERROR: No se afectaron filas en la actualización');
      return res.status(400).json({
        error: "No se pudo actualizar la tarea",
        query: query,
        values: values,
        result: result
      });
    }


    // Obtener la tarea actualizada
    console.log('Obteniendo tarea actualizada...');
    const [tareaActualizada] = await db.query("SELECT * FROM tareas WHERE id = ?", [id]);

    if (!tareaActualizada || tareaActualizada.length === 0) {
      console.log('ERROR: No se pudo obtener la tarea actualizada después de la actualización');
      return res.status(404).json({
        error: "No se pudo obtener la tarea actualizada",
        id: id
      });
    }


    console.log('Tarea actualizada correctamente:', tareaActualizada[0]);
    console.log('=== FIN actualizarTarea ===');
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
