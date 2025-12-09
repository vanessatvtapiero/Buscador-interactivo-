import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import tareasRoutes from "./routes/tareas.routes.js";

const app = express();

// Render usa un puerto dinámico:
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// rutas
app.use("/auth", authRoutes);
app.use("/tareas", tareasRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en el puerto ${PORT}`);
});
