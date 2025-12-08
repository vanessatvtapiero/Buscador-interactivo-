import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import tareasRoutes from "./routes/tareas.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// rutas
app.use("/auth", authRoutes);
app.use("/tareas", tareasRoutes);

app.listen(3001, () => {
  console.log("Servidor backend corriendo en http://localhost:3001");
});
