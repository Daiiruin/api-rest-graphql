import dotenv from "dotenv";
import express from "express";
import db from "./database";
import routes from "./routes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api", routes);

app.listen(PORT, async () => {
  try {
    await db.getConnection();
    console.log("📦 Connexion à la base de données réussie !");
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  } catch (error) {
    console.error("❌ Erreur de connexion à la base de données :", error);
  }
});
