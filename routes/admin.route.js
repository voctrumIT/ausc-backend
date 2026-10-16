import express from "express";
import {
  adminLogin,
  adminLogout,
  getAdminProfile,
  createAdmin,
} from "../controllers/admin.controller.js";
import { isAdminLoggedIn } from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// Public routes
router.post("/login", adminLogin);
router.post("/logout", adminLogout);

// Protected routes (requires the single 6hr JWT cookie)
router.get("/me", isAdminLoggedIn, getAdminProfile);
router.post("/create", isAdminLoggedIn, createAdmin);

export default router;
