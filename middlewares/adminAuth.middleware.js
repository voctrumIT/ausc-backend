import jwt from "jsonwebtoken";

export const isAdminLoggedIn = async (req, res, next) => {
  try {
    // Extract single token from cookies
    const token = req.cookies?.admin_token || req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access denied. No admin token provided in cookies.",
      });
    }

    const secret = process.env.JWT_SECRET || "ausc_admin_jwt_secret_2026";
    const decoded = jwt.verify(token, secret);

    // Attach decoded admin payload to request
    req.admin = decoded;
    next();
  } catch (error) {
    console.error("Error in isAdminLoggedIn middleware:", error.message);
    return res.status(403).json({
      success: false,
      error: "Invalid or expired admin session token.",
    });
  }
};

export const hasAdminPolicy = (requiredPolicy) => {
  return async (req, res, next) => {
    try {
      const policy = req.admin?.policy;

      if (!policy) {
        return res.status(403).json({
          success: false,
          error: "Access denied. Insufficient admin privileges.",
        });
      }

      const hasPermission =
        policy === "fullAccess" ||
        policy === requiredPolicy ||
        (Array.isArray(policy) && (policy.includes(requiredPolicy) || policy.includes("fullAccess")));

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          error: `Access denied. Requires '${requiredPolicy}' policy.`,
        });
      }

      next();
    } catch (error) {
      console.error("Error in hasAdminPolicy middleware:", error);
      return res.status(500).json({
        success: false,
        error: "Internal server error during authorization check.",
      });
    }
  };
};

export default isAdminLoggedIn;
