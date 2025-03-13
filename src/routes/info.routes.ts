import { Request, Response, Router } from "express";
import os from "os";
import db from "../database";

const router = Router();

/**
 * @swagger
 * /info:
 *   get:
 *     summary: Vérifier l'état du serveur et obtenir des détails
 *     tags: [Info]
 *     responses:
 *       200:
 *         description: Retourne des informations sur le serveur et la base de données
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 database:
 *                   type: string
 *                 port:
 *                   type: number
 *                 environment:
 *                   type: string
 *                 uptime:
 *                   type: string
 *                 server_ip:
 *                   type: string
 *                 timestamp:
 *                   type: string
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    await db.getConnection();

    res.json({
      status: "✅ Serveur en ligne",
      database: "✅ Connexion à la base de données réussie",
      port: process.env.PORT,
      environment: process.env.NODE_ENV || "development",
      uptime: `${process.uptime().toFixed(2)} secondes`,
      server_ip: os.networkInterfaces()?.eth0?.[0]?.address || "localhost",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "✅ Serveur en ligne",
      database: "❌ Erreur de connexion à la base de données",
      port: process.env.PORT || 3000,
      environment: process.env.NODE_ENV || "development",
      uptime: `${process.uptime().toFixed(2)} secondes`,
      server_ip: os.networkInterfaces()?.eth0?.[0]?.address || "localhost",
      timestamp: new Date().toISOString(),
      error: (error as Error).message,
    });
  }
});

export default router;
