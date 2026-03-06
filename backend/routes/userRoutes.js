import express from "express";
import {
  getUserDetails,
  loginUser,
  registerUser,
  updatePassword,
  updateUserProfile,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// protected routes
userRouter.get("/me", authMiddleware, getUserDetails);
userRouter.put("/profile", authMiddleware, updateUserProfile);
userRouter.put("/password", authMiddleware, updatePassword);

export default userRouter;
