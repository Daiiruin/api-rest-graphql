import { Express } from "express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sakila Video Rental API",
      version: "1.0.0",
      description:
        "Documentation de l'API de location de vidéos avec Express, TypeScript et MySQL.",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Serveur local",
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Indique où Swagger doit chercher les annotations JSDoc
};

const swaggerSpec = swaggerJsDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
