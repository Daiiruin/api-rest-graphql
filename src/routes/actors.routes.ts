import { Router } from "express";
import {
  getActorsByFilm,
  getAllActors,
} from "../controllers/actors.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/actors:
 *   get:
 *     summary: Récupérer tous les acteurs avec pagination
 *     security:
 *       - BearerAuth: []
 *     tags: [Actors]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre d'acteurs par page
 *     responses:
 *       200:
 *         description: Liste des acteurs
 */
router.get("/", authenticateJWT, getAllActors);

/**
 * @swagger
 * /api/actors/film/{film_id}:
 *   get:
 *     summary: Récupérer tous les acteurs d'un film spécifique
 *     security:
 *       - BearerAuth: []
 *     tags: [Actors]
 *     parameters:
 *       - in: path
 *         name: film_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du film
 *     responses:
 *       200:
 *         description: Liste des acteurs du film
 */
router.get("/film/:film_id", authenticateJWT, getActorsByFilm);

export default router;
