import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/auth";

export interface AuthenticatedRequest extends Request {
    user?: {
      userId: string;
      email: string;
      name: string;
    };
  }

  export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({ message: "Access token required" });
    }
    try{
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
  };

