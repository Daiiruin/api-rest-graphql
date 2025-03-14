import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token manquant ou invalide" });
    return;
  }

  if (!process.env.JWT_SECRET) {
    res.status(500).json({ message: "JWT_SECRET is not defined" });
    return;
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Token invalide", error: err.message });
    }

    if ((decoded as any).aud !== "type-access") {
      return res
        .status(403)
        .json({ message: "Accès interdit avec un Refresh Token" });
    }
    req.user = decoded as User;
    next();
  });
};
