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

/**
 * @swagger
 * tags:
 *   name: Films
 *   description: API pour gérer les films
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /films:
 *   get:
 *     summary: Récupérer la liste des films avec pagination
 *     tags: [Films]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de la page (défaut 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre de films par page (défaut 10)
 *     responses:
 *       200:
 *         description: Liste des films avec pagination
 *       401:
 *         description: Non autorisé (JWT manquant ou invalide)
 */
router.get("/", authenticateJWT, getAllFilms); // Authentification

/**
 * @swagger
 * /films/{id}:
 *   get:
 *     summary: Récupérer un film par son ID
 *     tags: [Films]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du film à récupérer
 *     responses:
 *       200:
 *         description: Film récupéré avec succès
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Film non trouvé
 */
router.get("/:id", authenticateJWT, getFilmById); // Authentification

/**
 * @swagger
 * /films:
 *   post:
 *     summary: Ajouter un nouveau film (Admin uniquement)
 *     tags: [Films]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               release_year:
 *                 type: integer
 *               language_id:
 *                 type: integer
 *               rental_duration:
 *                 type: integer
 *               rental_rate:
 *                 type: number
 *               length:
 *                 type: integer
 *               replacement_cost:
 *                 type: number
 *               rating:
 *                 type: string
 *             required:
 *               - title
 *               - description
 *               - release_year
 *               - language_id
 *               - rental_duration
 *               - rental_rate
 *               - length
 *               - replacement_cost
 *               - rating
 *     responses:
 *       201:
 *         description: Film ajouté avec succès
 *       400:
 *         description: Paramètres invalides
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé (Admin requis)
 */
router.post("/", authenticateJWT, isAdmin, createFilm); // Authentification + Admin

/**
 * @swagger
 * /films/{id}:
 *   put:
 *     summary: Modifier un film (Admin uniquement)
 *     tags: [Films]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du film à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               release_year:
 *                 type: integer
 *               language_id:
 *                 type: integer
 *               rental_duration:
 *                 type: integer
 *               rental_rate:
 *                 type: number
 *               length:
 *                 type: integer
 *               replacement_cost:
 *                 type: number
 *               rating:
 *                 type: string
 *     responses:
 *       200:
 *         description: Film mis à jour avec succès
 *       400:
 *         description: Paramètres invalides
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé (Admin requis)
 *       404:
 *         description: Film non trouvé
 */
router.put("/:id", authenticateJWT, isAdmin, updateFilm); // Authentification + Admin

/**
 * @swagger
 * /films/{id}:
 *   delete:
 *     summary: Supprimer un film (Admin uniquement)
 *     tags: [Films]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID du film à supprimer
 *     responses:
 *       200:
 *         description: Film supprimé avec succès
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé (Admin requis)
 *       404:
 *         description: Film non trouvé
 */
router.delete("/:id", authenticateJWT, isAdmin, deleteFilm); // Authentification + Admin

export default router;
