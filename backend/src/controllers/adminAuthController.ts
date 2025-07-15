import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { AdminAuth, AdminProfile } from '../models';
import { sequelize } from '../config/database';
import { AdminAuthRequest } from '../middleware/adminAuth';

// Interface for admin registration body
interface AdminRegisterRequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'staff';
  department?: string;
  position?: string;
}

// Interface for admin login body
interface AdminLoginRequestBody {
  email: string;
  password: string;
}

// Interface for admin JWT payload
interface AdminJwtPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Register a new admin user
 */
export const register = async (req: Request<{}, {}, AdminRegisterRequestBody>, res: Response): Promise<Response> => {
  const transaction = await sequelize.transaction();

  try {
    const { email, password, firstName, lastName, role = 'staff', department, position } = req.body;

    // Check if admin already exists
    const existingAdmin = await AdminAuth.findOne({ where: { email } });
    if (existingAdmin) {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Create new admin auth entry
    const adminAuth = await AdminAuth.create({
      email,
      password,
      role,
      verificationToken: uuidv4()
    }, { transaction });

    // Create admin profile
    const adminProfile = await AdminProfile.create({
      authId: adminAuth.id,
      firstName,
      lastName,
      department,
      position
    }, { transaction });

    // Generate JWT token
    const jwtSecret = process.env.ADMIN_JWT_SECRET || 'admin_jwt_secret';
    const payload: AdminJwtPayload = { id: adminAuth.id, email: adminAuth.email, role: adminAuth.role };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

    await transaction.commit();

    return res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        token,
        admin: {
          id: adminProfile.id,
          firstName: adminProfile.firstName,
          lastName: adminProfile.lastName,
          email: adminAuth.email,
          role: adminAuth.role
        }
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Admin registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to register admin',
      error: (error as Error).message
    });
  }
};

/**
 * Login admin user
 */
export const login = async (req: Request<{}, {}, AdminLoginRequestBody>, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const adminAuth = await AdminAuth.findOne({ 
      where: { email },
      include: [{
        model: AdminProfile,
        as: 'adminProfile'
      }]
    });

    if (!adminAuth) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if password is correct
    const isPasswordValid = await adminAuth.checkPassword(password);
    if (!isPasswordValid) {
      // Increment login attempts
      await adminAuth.update({ 
        loginAttempts: adminAuth.loginAttempts + 1,
        isLocked: adminAuth.loginAttempts >= 4 // Lock after 5 failed attempts
      });
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is locked
    if (adminAuth.isLocked) {
      return res.status(403).json({
        success: false,
        message: 'Account is locked. Please contact system administrator.'
      });
    }

    // Update last login time and reset login attempts
    await adminAuth.update({
      lastLogin: new Date(),
      loginAttempts: 0
    });

    // Generate JWT token
    const jwtSecret = process.env.ADMIN_JWT_SECRET || 'admin_jwt_secret';
    const payload: AdminJwtPayload = { id: adminAuth.id, email: adminAuth.email, role: adminAuth.role };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '7d' });

    const adminProfile = adminAuth.adminProfile;
    
    if (!adminProfile) {
      return res.status(404).json({
        success: false,
        message: 'Admin profile not found'
      });
    }

    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        admin: {
          id: adminProfile.id,
          firstName: adminProfile.firstName,
          lastName: adminProfile.lastName,
          email: adminAuth.email,
          role: adminAuth.role,
          department: adminProfile.department,
          position: adminProfile.position
        }
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: (error as Error).message
    });
  }
};

/**
 * Get admin profile
 */
export const getProfile = async (req: AdminAuthRequest, res: Response): Promise<Response> => {
  try {
    const adminId = req.admin?.id;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    // Find admin profile
    const adminAuth = await AdminAuth.findByPk(adminId, {
      attributes: { exclude: ['password'] },
      include: [{ 
        model: AdminProfile, 
        as: 'adminProfile'
      }]
    });

    if (!adminAuth || !adminAuth.adminProfile) {
      return res.status(404).json({
        success: false,
        message: 'Admin profile not found'
      });
    }

    return res.json({
      success: true,
      data: {
        id: adminAuth.adminProfile.id,
        email: adminAuth.email,
        firstName: adminAuth.adminProfile.firstName,
        lastName: adminAuth.adminProfile.lastName,
        role: adminAuth.role,
        department: adminAuth.adminProfile.department,
        position: adminAuth.adminProfile.position,
        isEmailVerified: adminAuth.isEmailVerified
      }
    });
  } catch (error) {
    console.error('Get admin profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get admin profile',
      error: (error as Error).message
    });
  }
};

export default {
  register,
  login,
  getProfile
}; 