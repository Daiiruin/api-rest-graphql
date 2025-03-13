import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Actor {
    actor_id: Int
    first_name: String
    last_name: String
  }

  type FilmWithActors {
    film_title: String
    actors: [Actor]
  }

  type Query {
    getActors(page: Int, limit: Int): [Actor]
    getActorsByFilm(film_id: Int!): FilmWithActors
  }
`;
