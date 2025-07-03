import { jwtVerify } from '##/src/config/lib/jwt.js';
import User from '##/src/models/user.model.js';
import { checkRole } from '##/utility/checkRole.js';

async function isAuthenticated(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1] || req.query.token;

  // No token provided
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please provide a valid token.',
      code: 'AUTH_TOKEN_MISSING',
      field: 'token',
    });
  }

  try {
    // Verify token and check expiration
    const { userId } = jwtVerify(token, 'access');
    // Find and verify user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found. Please contact support.',
        code: 'USER_NOT_FOUND',
        field: 'token',
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    // Handle specific JWT errors
    return res.status(401).json({
      success: false,
      message: 'Session Expired, Please Login again',
      error: error.message,
      field: 'token',
    });
  }
}

function isRouteAllowed(rolesAllowed) {
  return function verifyRole(req, res, next) {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required to access this resource.',
          code: 'AUTH_REQUIRED',
        });
      }

      if (checkRole(rolesAllowed, req.user.role)) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this resource.',
        code: 'UNAUTHORIZED_ACCESS',
        requiredRoles: rolesAllowed,
        userRole: req.user.role,
      });
    } catch (error) {
      console.error('Role verification error:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while verifying your permissions.',
        code: 'ROLE_VERIFICATION_ERROR',
      });
    }
  };
}

export { isAuthenticated, isRouteAllowed };
