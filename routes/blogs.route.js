import express from "express";
import {
  getBlogs,
  getBlogByIdOrSlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogs.controller.js";
import { upload } from "../lib/multer.lib.js";
import { isLoggedIn, hasAccess } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:idOrSlug", getBlogByIdOrSlug);
router.post("/", isLoggedIn, hasAccess('writeAccess'),upload.single("image"), createBlog);
router.put("/:id", isLoggedIn, hasAccess('writeAccess'),upload.single("image"), updateBlog);
router.delete("/:id", isLoggedIn, hasAccess('fullAccess'), deleteBlog);

export default router;
