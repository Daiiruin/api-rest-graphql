import { Router } from "express";
import authRoutes from "./auth.routes"; // Routes d'authentification (login)
import filmRoutes from "./film.routes"; // Routes des films
import infoRoutes from "./info.routes";

const router = Router();

router.use("/films", filmRoutes);
router.use("/auth", authRoutes);
router.use("/info", infoRoutes);

export default router;
