import { db } from "../database/db.js";

export const login = async (req, res) => {
  const { correo, password } = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT id, nombre, correo, rol FROM usuarios WHERE correo = ? AND password = ?",
      [correo, password]
    );

    if (rows.length > 0) {
      // Devolvemos el primer usuario encontrado
      return res.json([{
        id: rows[0].id,
        name: rows[0].nombre,
        email: rows[0].correo,
        role: rows[0].rol
      }]);
    } else {
      return res.status(401).json({ error: "Credenciales inválidas" });
    }
  } catch (error) {
    console.log("Error en login backend:", error);
    res.status(500).json({ error: "Error interno" });
  }
};
