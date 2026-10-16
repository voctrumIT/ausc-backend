import express from "express";
import {
  adminLogin,
  adminLogout,
  getAdminProfile,
  createAdmin,
} from "../controllers/admin.controller.js";
import { isLoggedIn } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/login", adminLogin);
router.post("/logout", adminLogout);

// Protected routes (requires the single 6hr JWT cookie)
router.get("/me", isLoggedIn, getAdminProfile);
router.post("/create", isLoggedIn, createAdmin);

export default router;
