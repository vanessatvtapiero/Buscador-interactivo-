import { db } from "../database/db.js";

export const login = async (req, res) => {
  const { correo, password } = req.body;

  if (!correo || !password) {
    return res.status(400).json({ error: "Correo y contraseña son requeridos" });
  }

  try {
    const [rows] = await db.execute(
      "SELECT id, nombre, apellidos, correo, password FROM usuarios WHERE correo = ?",
      [correo]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    const user = rows[0];
    
    // Comparación de contraseña simple (sin bcrypt)
    if (password !== user.password) {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }

    // Devolvemos los datos del usuario sin el campo rol
    return res.json([{
      id: user.id,
      name: user.nombre,
      lastName: user.apellidos,
      email: user.correo
      // No incluimos el rol
    }]);

  } catch (error) {
    console.error("Error en login backend:", error);
    return res.status(500).json({ 
      error: "Error interno del servidor",
      details: error.message
    });
  }
};