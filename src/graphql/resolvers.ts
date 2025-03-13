import { RowDataPacket } from "mysql2";
import db from "../database";

export const resolvers = {
  Query: {
    getActors: async (
      _: any,
      { page = 1, limit = 10 }: { page: number; limit: number }
    ) => {
      const offset = (page - 1) * limit;

      const [actors] = (await db.query(
        "SELECT actor_id, first_name, last_name FROM actor LIMIT ? OFFSET ?",
        [limit, offset]
      )) as [RowDataPacket[], any];

      return actors.length > 0 ? actors : null;
    },
    getActorsByFilm: async (_: any, { film_id }: { film_id: number }) => {
      const [filmResult] = (await db.query(
        "SELECT title FROM film WHERE film_id = ?",
        [film_id]
      )) as [RowDataPacket[], any];

      if (filmResult.length === 0) {
        throw new Error("Film non trouvé");
      }

      const filmTitle: string = filmResult[0].title;

      const [actors] = (await db.query(
        `SELECT actor.actor_id, actor.first_name, actor.last_name
         FROM actor
         INNER JOIN film_actor ON actor.actor_id = film_actor.actor_id
         WHERE film_actor.film_id = ?`,
        [film_id]
      )) as [RowDataPacket[], any];

      return {
        film_title: filmTitle,
        actors: actors,
      };
    },
  },
};
