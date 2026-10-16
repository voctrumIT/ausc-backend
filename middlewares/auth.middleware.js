import jwt from 'jsonwebtoken';

export const isLoggedIn = async (req, res, next) => {
    try {
        const token =
            req.cookies?.ausc_root_token ||
            req.headers?.authorization?.replace(/^Bearer\s+/i, "");

        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. No authentication token provided.'
            });
        }

        const secret = process.env.JWT_SECRET || 'your_jwt_secret';
        const decoded = jwt.verify(token, secret);

        // Attach to request
        req.user = decoded;
        req.admin = decoded;

        // Ensure policies is always an array
        if (decoded.policies) {
            req.user.policies = Array.isArray(decoded.policies)
                ? decoded.policies
                : [decoded.policies];
        } else if (decoded.policy) {
            req.user.policies = Array.isArray(decoded.policy)
                ? decoded.policy
                : [decoded.policy];
        } else {
            req.user.policies = ['fullAccess'];
        }

        next();
    } catch (error) {
        console.error('Error in isLoggedIn middleware:', error.message);
        return res.status(403).json({
            success: false,
            error: 'Invalid or expired authentication token.'
        });
    }
};

export const hasAccess = (requiredPolicy) => {
    return async (req, res, next) => {
        try {
            const policies = req.user?.policies || [];

            if (!policies.includes(requiredPolicy) && !policies.includes('fullAccess')) {
                return res.status(403).json({
                    success: false,
                    error: `Access denied. Insufficient permissions for '${requiredPolicy}'.`
                });
            }

            next();
        } catch (error) {
            console.error('Error in hasAccess middleware:', error);
            return res.status(500).json({
                success: false,
                error: 'Internal server error during authorization.'
            });
        }
    };
};