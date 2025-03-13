import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import db from "../database";

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token manquant" });
    return;
  }

  const query = "SELECT * FROM user WHERE refresh_token = ?";
  const [rows]: [any[], any] = await db.query(query, [refreshToken]);

  if (rows.length === 0) {
    res.status(403).json({ message: "Refresh token invalide" });
    return;
  }

  const user = rows[0];

  jwt.verify(
    refreshToken,
    process.env.JWT_SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ message: "Refresh token expiré ou invalide" });
      }

      const newAccessToken = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      res.json({ accessToken: newAccessToken });
    }
  );
};
