import { Request, Response } from "express";
import User from "../models/userModel";
import {
  generateToken,
  hashPassword,
  comparePassword,
  verifyGoogleToken,
} from "../utils/auth";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if(!email || !password || !name){
        return res.status(400).json({message: "All fields are required"});
    }
    // Check if user already exists
    const existingUser = await User.scan("email").eq(email).exec();
   
    if (existingUser.count > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with default role "user"
    const user = await User.create({
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      password: hashedPassword,
      name,
      role: "user",
      provider: "email",
      isEmailVerified: false,
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const registerTeacher = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    if(!email || !password || !name){
        return res.status(400).json({message: "All fields are required"});
    }
    // Check if user already exists
    const existingUser = await User.scan("email").eq(email).exec();
   
    if (existingUser.count > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create teacher
    const user = await User.create({
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      email,
      password: hashedPassword,
      name,
      role: "teacher",
      provider: "email",
      isEmailVerified: false,
    });

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    res.status(201).json({
      message: "Teacher registered successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Teacher registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const users = await User.scan("email").eq(email).exec();
    if (users.count === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { idToken } = req.body;

    // Verify Google token
    const googleUser = await verifyGoogleToken(idToken);

    // Check if user exists
    let users = await User.scan("googleId").eq(googleUser.googleId).exec();
    
    if (users.count === 0) {
      // Check by email
      users = await User.scan("email").eq(googleUser.email).exec();
      
      if (users.count === 0) {
        // Create new user with default role "user"
        const user = await User.create({
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.picture,
          role: "user",
          provider: "google",
          googleId: googleUser.googleId,
          isEmailVerified: true,
        });

        const token = generateToken({
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        });

        return res.status(201).json({
          message: "User created successfully",
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            avatar: user.avatar,
            role: user.role,
          },
        });
      } else {
        // Update existing user with Google ID
        const user = users[0];
        await User.update({
          id: user.id,
          googleId: googleUser.googleId,
          avatar: googleUser.picture,
          provider: "google",
          isEmailVerified: true,
        });
      }
    }

    const user = users[0];
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;
    
    const user = await User.get(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const upgradeToTeacher = async (req: Request, res: Response) => {
  try {
    const { userId } = (req as any).user;
    
    const user = await User.get(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "teacher") {
      return res.status(400).json({ message: "User is already a teacher" });
    }

    // Update user role to teacher
    await User.update({
      id: userId,
      role: "teacher",
    });

    // Generate new token with updated role
    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: "teacher",
    });

    res.json({
      message: "Successfully upgraded to teacher",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: "teacher",
      },
    });
  } catch (error) {
    console.error("Upgrade to teacher error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};