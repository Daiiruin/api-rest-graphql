import { Request, Response } from "express";
import db from "../database";

// 🔥 GET /films - Lister tous les films
export const getAllFilms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const offset = (page - 1) * limit;

    const [films] = await db.query("SELECT * FROM film LIMIT ? OFFSET ?", [
      limit,
      offset,
    ]);

    const [rows] = (await db.query("SELECT COUNT(*) as count FROM film")) as [
      any[],
      any
    ];
    const count = rows[0].count;
    const totalFilms = count;
    const totalPages = Math.ceil(totalFilms / limit);

    res.json({
      films,
      pagination: {
        page,
        limit,
        totalFilms,
        totalPages,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des films", error });
  }
};

// 🔥 GET /films/:id - Récupérer un film par ID
export const getFilmById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const [film] = await db.query("SELECT * FROM film WHERE film_id = ?", [id]);

    if (!(film as any).length) {
      res.status(404).json({ message: "Film non trouvé" });
      return;
    }

    res.json((film as any)[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération du film", error });
  }
};

// 🔥 POST /films - Ajouter un film (Admin uniquement)
export const createFilm = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    title,
    description,
    release_year,
    language_id,
    rental_duration,
    rental_rate,
    length,
    replacement_cost,
    rating,
  } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO film (title, description, release_year, language_id, rental_duration, rental_rate, length, replacement_cost, rating, last_update) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())",
      [
        title,
        description,
        release_year,
        language_id,
        rental_duration,
        rental_rate,
        length,
        replacement_cost,
        rating,
      ]
    );

    res
      .status(201)
      .json({ message: "Film ajouté", filmId: (result as any).insertId });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout du film", error });
  }
};

// 🔥 PUT /films/:id - Modifier un film (Admin uniquement)
export const updateFilm = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const {
    title,
    description,
    release_year,
    language_id,
    rental_duration,
    rental_rate,
    length,
    replacement_cost,
    rating,
  } = req.body;

  try {
    const [result] = await db.query(
      "UPDATE film SET title=?, description=?, release_year=?, language_id=?, rental_duration=?, rental_rate=?, length=?, replacement_cost=?, rating=?, last_update=NOW() WHERE film_id=?",
      [
        title,
        description,
        release_year,
        language_id,
        rental_duration,
        rental_rate,
        length,
        replacement_cost,
        rating,
        id,
      ]
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: "Film non trouvé" });
      return;
    }

    res.json({ message: "Film mis à jour" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la mise à jour du film", error });
  }
};

// 🔥 DELETE /films/:id - Supprimer un film (Admin uniquement)
export const deleteFilm = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  try {
    const [result] = await db.query("DELETE FROM film WHERE film_id = ?", [id]);

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ message: "Film non trouvé" });
      return;
    }

    res.json({ message: "Film supprimé" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du film", error });
  }
};
