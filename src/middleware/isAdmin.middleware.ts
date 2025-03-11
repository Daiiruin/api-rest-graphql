import { NextFunction, Request, Response } from "express";

// Middleware pour vérifier le rôle d'admin
export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "admin") {
    res
      .status(403)
      .json({ message: "Accès interdit : Administrateur uniquement" });
    return;
  }

  next();
};
