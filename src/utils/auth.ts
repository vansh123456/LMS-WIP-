import "dotenv/config";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";

const JWT_SECRET = process.env.JWT_SECRET;
console.log("jwt secret from utils/auth.ts is:" + JWT_SECRET);
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
console.log("google client id is:" + GOOGLE_CLIENT_ID); 

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
}

export const generateToken = (payload: JWTPayload): string => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2d" });
};

export const verifyToken = (token: string): JWTPayload => {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  const decoded = jwt.verify(token, JWT_SECRET);
  if (
    typeof decoded === "object" &&
    decoded !== null &&
    "userId" in decoded &&
    "email" in decoded &&
    "name" in decoded
  ) {
    return decoded as JWTPayload;
  }
  throw new Error("Invalid token payload");
};

  export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  };

  export const comparePassword = async (
    password: string,
    hashedPassword: string
  ): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
  };

  export const verifyGoogleToken = async(idToken: string) => {
    const client = new OAuth2Client(GOOGLE_CLIENT_ID);

    try {
        const ticket = await client.verifyIdToken({
          idToken,
          audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return {
            googleId: payload?.sub,
            email: payload?.email,
            name: payload?.name,
            picture: payload?.picture,
        };
    } catch (error) {
        console.error("Error verifying Google token:", error);
        throw new Error("Invalid Google token");
    }
  };
