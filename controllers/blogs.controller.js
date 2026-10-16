import prisma from "../lib/prisma.lib.js";
import { uploadBlogImageToS3 } from "../lib/s3.lib.js";

// Helper to generate a URL-friendly slug
const generateSlug = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

// GET /api/blogs
export const getBlogs = async (req, res) => {
  try {
    let { page = 1, limit = 50, search = "", category = "", status = "published" } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    const where = {
      ...(status === "all"
        ? {}
        : status === "draft"
        ? { isPublished: false }
        : { isPublished: true }),
      ...(category ? { category: { equals: category, mode: "insensitive" } } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { excerpt: { contains: search, mode: "insensitive" } },
              { category: { contains: search, mode: "insensitive" } },
              { author: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [blogs, totalCount, totalAll, totalPublished, totalDrafts] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.blog.count({ where }),
      prisma.blog.count(),
      prisma.blog.count({ where: { isPublished: true } }),
      prisma.blog.count({ where: { isPublished: false } }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        totalCount,
        totalPages,
        currentPage: page,
        limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      counts: {
        all: totalAll,
        published: totalPublished,
        draft: totalDrafts,
      },
    });
  } catch (error) {
    console.error("Error in getBlogs:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch blogs",
    });
  }
};

// GET /api/blogs/:idOrSlug
export const getBlogByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    const blog = await prisma.blog.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        error: "Blog post not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    console.error("Error in getBlogByIdOrSlug:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch blog post",
    });
  }
};

// POST /api/blogs
export const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, author, date, isPublished } = req.body;
    let { slug, image } = req.body;

    if (!title || !content || !excerpt || !category) {
      return res.status(400).json({
        success: false,
        error: "Title, excerpt, content, and category are required",
      });
    }

    // Handle file upload to S3 if file attached
    if (req.file) {
      image = await uploadBlogImageToS3(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        error: "Blog image (file upload or image URL) is required",
      });
    }

    if (!slug) {
      slug = generateSlug(title);
    }

    // Ensure unique slug
    let finalSlug = slug;
    let counter = 1;
    while (await prisma.blog.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    const newBlog = await prisma.blog.create({
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content,
        category,
        author: author || "AuSC Admissions",
        date: date || new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
        image,
        isPublished: isPublished !== undefined ? String(isPublished).toLowerCase() === "true" : true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: newBlog,
    });
  } catch (error) {
    console.error("Error in createBlog:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to create blog",
    });
  }
};

// PUT /api/blogs/:id
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, category, author, date, isPublished } = req.body;
    let { slug, image } = req.body;

    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({
        success: false,
        error: "Blog not found",
      });
    }

    if (req.file) {
      image = await uploadBlogImageToS3(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype
      );
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(excerpt && { excerpt }),
        ...(content && { content }),
        ...(category && { category }),
        ...(author && { author }),
        ...(date && { date }),
        ...(image && { image }),
        ...(isPublished !== undefined && { isPublished: String(isPublished).toLowerCase() === "true" }),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Blog updated successfully",
      data: updatedBlog,
    });
  } catch (error) {
    console.error("Error in updateBlog:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Failed to update blog",
    });
  }
};

// DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.blog.delete({ where: { id } });

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteBlog:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to delete blog",
    });
  }
};
