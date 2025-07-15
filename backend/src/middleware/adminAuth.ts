import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AdminAuth } from '../models';
import { Request as ExpressRequest } from 'express';

// Admin Auth Request interface
export interface AdminAuthRequest extends ExpressRequest {
  admin?: {
    id: string;
    email: string;
    role: 'admin' | 'staff';
  };
}

// Admin Authentication middleware
export const authenticate = async (req: AdminAuthRequest, res: Response, next: NextFunction): Promise<void | Response> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication failed. No token provided.' 
      });
    }

    // Extract token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication failed. Invalid token format.' 
      });
    }

    // Verify token using admin JWT secret
    const decoded = jwt.verify(
      token, 
      process.env.ADMIN_JWT_SECRET || 'admin_jwt_secret'
    ) as jwt.JwtPayload;

    // Check if admin exists
    const admin = await AdminAuth.findByPk(decoded.id);
    
    if (!admin || admin.isLocked) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication failed. Admin not found or account locked.' 
      });
    }

    // Add admin to request object
    req.admin = {
      id: admin.id,
      email: admin.email,
      role: admin.role
    };

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication failed. Invalid token.' 
        });
      } else if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Authentication failed. Token expired.' 
        });
      }
    }
    
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error.' 
    });
  }
};

/**
 * Middleware to check if admin has required role
 */
export const checkAdminRole = (roles: string[]) => {
  return (req: AdminAuthRequest, res: Response, next: NextFunction): void | Response => {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

export default {
  authenticate,
  checkAdminRole
}; 