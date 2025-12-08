import { Router } from "express";
import { getTareas, crearTarea, actualizarTarea, eliminarTarea } from "../controllers/tareas.controller.js";

const router = Router();

router.get("/:userId", getTareas);
router.post("/", crearTarea);
router.put("/:id", actualizarTarea);
router.delete("/:id", eliminarTarea);

export default router;
