import { Request, Response } from "express";
import { RowDataPacket } from "mysql2";
import db from "../database";

/**
 * 🔥 Récupérer tous les acteurs avec pagination
 * GET /api/actors?page=1&limit=10
 */
export const getAllActors = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const [actors] = (await db.query(
      "SELECT actor_id, first_name, last_name FROM actor LIMIT ? OFFSET ?",
      [limit, offset]
    )) as [RowDataPacket[], any];

    const [total] = (await db.query("SELECT COUNT(*) AS count FROM actor")) as [
      RowDataPacket[],
      any
    ];
    const totalActors = total[0].count;
    const totalPages = Math.ceil(totalActors / limit);

    res.json({
      actors,
      pagination: {
        page,
        limit,
        totalActors,
        totalPages,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des acteurs", error });
  }
};

/**
 * 🔥 Récupérer tous les acteurs d'un film spécifique
 * GET /api/actors/film/:film_id
 */
export const getActorsByFilm = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { film_id } = req.params;

  try {
    // Vérifier si le film existe
    const [filmResult] = (await db.query(
      "SELECT title FROM film WHERE film_id = ?",
      [film_id]
    )) as [RowDataPacket[], any];

    if (filmResult.length === 0) {
      res.status(404).json({ message: "Film non trouvé" });
      return;
    }

    const filmTitle: string = filmResult[0].title;

    // Récupérer les acteurs du film
    const [actors] = (await db.query(
      `SELECT actor.actor_id, actor.first_name, actor.last_name
       FROM actor
       INNER JOIN film_actor ON actor.actor_id = film_actor.actor_id
       WHERE film_actor.film_id = ?`,
      [film_id]
    )) as [RowDataPacket[], any];

    res.json({
      film_title: filmTitle,
      actors,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des acteurs du film",
      error,
    });
  }
};
