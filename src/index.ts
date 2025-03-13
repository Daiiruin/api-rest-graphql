import dotenv from "dotenv";
import express from "express";
import { setupSwagger } from "./config/swagger";
import db from "./database";
import { setupGraphQL } from "./graphql/server";
import routes from "./routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

setupSwagger(app);
setupGraphQL(app);
app.use("/api", routes);

app.listen(PORT, async () => {
  try {
    await db.getConnection();
    console.log("📦 Connexion à la base de données réussie !");
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📖 Documentation Swagger : http://localhost:${PORT}/api-docs`);
    console.log(`🔗 GraphQL Playground : http://localhost:${PORT}/graphql`);
  } catch (error) {
    console.error("❌ Erreur de connexion à la base de données :", error);
  }
});
