import User from "../models/userModel.js";
import validator from "validator";
import bacrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const tokenExpiry = "24h";

const createToken = (userId) => {
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: tokenExpiry });
};

// Register
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all the fields" });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: "Invalid email" });
  }
  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 8 characters",
    });
  }

  try {
    if (await User.findOne({ email })) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    const hashed = await bacrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = createToken(user._id);
    return res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Please fill all the fields" });
  }
  try {
    const user = await User.findOne({ email });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
