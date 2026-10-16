import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.lib.js";

const SIX_HOURS_MS = 6 * 60 * 60 * 1000;
const JWT_SECRET = process.env.JWT_SECRET || "ausc_admin_jwt_secret_2026";

/**
 * Admin Login
 * Validates credentials, creates a single JWT token valid for 6 hours,
 * and sets it in an HTTP-only cookie.
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if admin exists
    let admin = await prisma.admin.findUnique({
      where: { email: normalizedEmail },
    });

    // If database has 0 admins, auto-bootstrap the first admin on login if email is admin@ausc.edu.au
    if (!admin) {
      const adminCount = await prisma.admin.count();
      if (adminCount === 0 && (normalizedEmail === "admin@ausc.edu.au" || normalizedEmail.includes("admin"))) {
        const hashedPassword = await bcrypt.hash(password, 10);
        admin = await prisma.admin.create({
          data: {
            email: normalizedEmail,
            password: hashedPassword,
            policy: "fullAccess",
            createdBy: "system_bootstrap",
          },
        });
        console.log(`Initial admin created on first login: ${normalizedEmail}`);
      } else {
        return res.status(401).json({
          success: false,
          error: "Invalid email or password",
        });
      }
    } else {
      // Validate password
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: "Invalid email or password",
        });
      }
    }

    // Issue single JWT token with 6 hours validity
    const token = jwt.sign(
      {
        adminId: admin.id,
        email: admin.email,
        policy: admin.policy,
      },
      JWT_SECRET,
      { expiresIn: "6h" }
    );

    // Store in a single cookie
    res.cookie("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: SIX_HOURS_MS,
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Admin login successful",
      admin: {
        id: admin.id,
        email: admin.email,
        policy: admin.policy,
        createdAt: admin.createdAt,
        createdBy: admin.createdBy,
      },
    });
  } catch (error) {
    console.error("Error in adminLogin controller:", error);
    return res.status(500).json({
      success: false,
      error: "An error occurred during admin login",
    });
  }
};

/**
 * Admin Logout
 * Clears the single admin cookie
 */
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("admin_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    return res.status(200).json({
      success: true,
      message: "Admin logged out successfully",
    });
  } catch (error) {
    console.error("Error in adminLogout controller:", error);
    return res.status(500).json({
      success: false,
      error: "An error occurred during admin logout",
    });
  }
};

/**
 * Get Current Admin Profile (Protected)
 */
export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin?.adminId;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        error: "Unauthorized",
      });
    }

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
      select: {
        id: true,
        email: true,
        policy: true,
        createdBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin record not found",
      });
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    console.error("Error in getAdminProfile controller:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to fetch admin profile",
    });
  }
};

/**
 * Create Admin Account
 */
export const createAdmin = async (req, res) => {
  try {
    const { email, password, policy, createdBy } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingAdmin = await prisma.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        error: "Admin with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const creator = req.admin?.email || createdBy || "superadmin";

    const newAdmin = await prisma.admin.create({
      data: {
        email: normalizedEmail,
        password: hashedPassword,
        policy: policy || "fullAccess",
        createdBy: creator,
      },
      select: {
        id: true,
        email: true,
        policy: true,
        createdBy: true,
        createdAt: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: newAdmin,
    });
  } catch (error) {
    console.error("Error in createAdmin controller:", error);
    return res.status(500).json({
      success: false,
      error: "Failed to create admin account",
    });
  }
};
