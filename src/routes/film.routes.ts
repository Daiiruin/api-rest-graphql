import { Router } from "express";
import {
  createFilm,
  deleteFilm,
  getAllFilms,
  getFilmById,
  updateFilm,
} from "../controllers/film.controller";
import { authenticateJWT } from "../middleware/auth.middleware";
import { isAdmin } from "../middleware/isAdmin.middleware";

const router = Router();

router.get("/", getAllFilms);
router.get("/:id", getFilmById);
router.post("/", authenticateJWT, isAdmin, createFilm); // Authentification + Admin
router.put("/:id", authenticateJWT, isAdmin, updateFilm); // Authentification + Admin
router.delete("/:id", authenticateJWT, isAdmin, deleteFilm); // Authentification + Admin

export default router;
