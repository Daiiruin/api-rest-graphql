import { Request, Response } from "express";
import jwt from "jsonwebtoken";

let userIdCounter = 1;

export const login = (req: Request, res: Response): void => {
  const { username, password } = req.body;

  // Vérification si c'est un admin
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const user = { id: userIdCounter++, username, role: "admin" };

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "JWT_SECRET is not defined" });
      return;
    }

    const token = jwt.sign(user, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.json({
      message: `Bienvenue ${username}, vous êtes connecté en tant qu'admin.`,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
    return;
  }

  // Vérification pour les utilisateurs lambda
  if (username && password) {
    const user = { id: userIdCounter++, username, role: "user" };

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "JWT_SECRET is not defined" });
      return;
    }

    const token = jwt.sign(user, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.json({
      message: `Bienvenue ${username}, vous êtes connecté en tant qu'utilisateur.`,
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
    return;
  }

  // Si les identifiants sont incorrects
  res.status(401).json({ message: "Identifiants incorrects" });
  return;
};
