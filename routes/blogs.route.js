import express from "express";
import {
  getBlogs,
  getBlogByIdOrSlug,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../controllers/blogs.controller.js";
import { upload } from "../lib/multer.lib.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:idOrSlug", getBlogByIdOrSlug);
router.post("/", upload.single("image"), createBlog);
router.put("/:id", upload.single("image"), updateBlog);
router.delete("/:id", deleteBlog);

export default router;
