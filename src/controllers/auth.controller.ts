import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ResultSetHeader } from "mysql2";
import db from "../database";

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  const query = "SELECT * FROM user WHERE username = ?";
  const [rows]: [any[], any] = await db.query(query, [username]);

  if (Array.isArray(rows) && rows.length === 0) {
    res
      .status(401)
      .json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    return;
  }

  const user = rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res
      .status(401)
      .json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    return;
  }

  const accessToken = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  const updateQuery = "UPDATE user SET refresh_token = ? WHERE id = ?";
  await db.query(updateQuery, [refreshToken, user.id]);

  res.json({
    message: `Bienvenue ${username}, vous êtes connecté en tant que ${user.role}.`,
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
    },
  });
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  const queryCheckUser = "SELECT * FROM user WHERE username = ?";
  const [existingUser]: [any[], any] = await db.query(queryCheckUser, [
    username,
  ]);

  if (existingUser.length > 0) {
    res.status(400).json({ message: "Nom d'utilisateur déjà pris" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Génération du Refresh Token (7 jours)
  const refreshToken = jwt.sign(
    { username, role: "user" },
    process.env.JWT_SECRET as string,
    { expiresIn: "7d" }
  );

  const queryInsertUser =
    "INSERT INTO user (username, email, password, role, refresh_token) VALUES (?, ?, ?, ?, ?)";
  const [result]: [ResultSetHeader, any] = await db.query(queryInsertUser, [
    username,
    email,
    hashedPassword,
    "user",
    refreshToken,
  ]);

  const insertId = result.insertId;

  // Génération du Access Token (1h)
  const accessToken = jwt.sign(
    { id: insertId, username, role: "user" },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Inscription réussie",
    accessToken,
    refreshToken,
    user: {
      id: insertId,
      username,
      role: "user",
    },
  });
};
