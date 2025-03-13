import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { Application, json } from "express";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";

export const setupGraphQL = async (app: Application) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use("/graphql", json(), expressMiddleware(server));

  console.log(`🚀 GraphQL Server prêt sur http://localhost:3000/graphql`);
};
