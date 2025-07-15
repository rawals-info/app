import { Response } from 'express';
import { Op } from 'sequelize';
import { Recommendation } from '../models';
import { AuthRequest } from '../types';

// Get all recommendations for a user with optional filters
export const getRecommendations = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const { 
      type, priority, isRead, isDismissed, 
      startDate, endDate, limit = '50', offset = '0' 
    } = req.query;

    // Build filter conditions
    const whereConditions: any = { userId };

    // Add type filter if provided
    if (type) {
      whereConditions.type = type;
    }

    // Add priority filter if provided
    if (priority) {
      whereConditions.priority = priority;
    }

    // Add read status filter if provided
    if (isRead !== undefined) {
      whereConditions.isRead = isRead === 'true';
    }

    // Add dismissed status filter if provided
    if (isDismissed !== undefined) {
      whereConditions.isDismissed = isDismissed === 'true';
    }

    // Add date range filter if provided
    if (startDate && endDate) {
      whereConditions.triggerDateTime = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
      };
    } else if (startDate) {
      whereConditions.triggerDateTime = {
        [Op.gte]: new Date(startDate as string)
      };
    } else if (endDate) {
      whereConditions.triggerDateTime = {
        [Op.lte]: new Date(endDate as string)
      };
    }

    // Get recommendations with pagination
    const recommendations = await Recommendation.findAndCountAll({
      where: whereConditions,
      order: [
        ['priority', 'DESC'],
        ['triggerDateTime', 'DESC']
      ],
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10)
    });

    return res.json({
      success: true,
      data: {
        total: recommendations.count,
        recommendations: recommendations.rows
      }
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve recommendations',
      error: (error as Error).message
    });
  }
};

// Get a specific recommendation by ID
export const getRecommendationById = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const { id } = req.params;

    // Find recommendation
    const recommendation = await Recommendation.findOne({
      where: { id, userId }
    });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    return res.json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    console.error('Get recommendation by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve recommendation',
      error: (error as Error).message
    });
  }
};

// Mark recommendation as read
export const markAsRead = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const { id } = req.params;

    // Find recommendation
    const recommendation = await Recommendation.findOne({
      where: { id, userId }
    });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    // Update read status
    await recommendation.update({ isRead: true });

    return res.json({
      success: true,
      message: 'Recommendation marked as read',
      data: recommendation
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark recommendation as read',
      error: (error as Error).message
    });
  }
};

// Mark recommendation as dismissed
export const dismissRecommendation = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const { id } = req.params;

    // Find recommendation
    const recommendation = await Recommendation.findOne({
      where: { id, userId }
    });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    // Update dismissed status
    await recommendation.update({ isDismissed: true });

    return res.json({
      success: true,
      message: 'Recommendation dismissed',
      data: recommendation
    });
  } catch (error) {
    console.error('Dismiss recommendation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to dismiss recommendation',
      error: (error as Error).message
    });
  }
};

// Record action taken on recommendation
export const recordAction = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const { id } = req.params;
    const { actionDetails } = req.body;

    // Find recommendation
    const recommendation = await Recommendation.findOne({
      where: { id, userId }
    });

    if (!recommendation) {
      return res.status(404).json({
        success: false,
        message: 'Recommendation not found'
      });
    }

    // Update action status and details
    await recommendation.update({ 
      actionTaken: true,
      actionDetails: actionDetails || {},
      isRead: true
    });

    return res.json({
      success: true,
      message: 'Action recorded for recommendation',
      data: recommendation
    });
  } catch (error) {
    console.error('Record action error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record action for recommendation',
      error: (error as Error).message
    });
  }
};

// Mark all recommendations as read
export const markAllAsRead = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const { type } = req.query;

    // Build filter conditions
    const whereConditions: any = { 
      userId, 
      isRead: false
    };

    // Add type filter if provided
    if (type) {
      whereConditions.type = type;
    }

    // Update all matching recommendations
    const [updatedCount] = await Recommendation.update(
      { isRead: true },
      { where: whereConditions }
    );

    return res.json({
      success: true,
      message: 'Recommendations marked as read',
      data: { count: updatedCount }
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark recommendations as read',
      error: (error as Error).message
    });
  }
};

// Create a new recommendation (usually triggered by system events, but useful for testing)
export const createRecommendation = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const { 
      type, priority, title, description, suggestedAction,
      triggerType, triggerValue
    } = req.body;

    // Create recommendation
    const recommendation = await Recommendation.create({
      userId,
      type,
      priority: priority || 'medium',
      title,
      description,
      suggestedAction,
      triggerType,
      triggerValue: triggerValue || {},
      triggerDateTime: new Date(),
      isRead: false,
      isDismissed: false,
      actionTaken: false
    });

    return res.status(201).json({
      success: true,
      message: 'Recommendation created successfully',
      data: recommendation
    });
  } catch (error) {
    console.error('Create recommendation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create recommendation',
      error: (error as Error).message
    });
  }
};

// Delete a recommendation (mainly for admin/testing purposes)
export const deleteRecommendation = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const { id } = req.params;

    // Check user role
    if (req.user?.role !== 'admin') {
      // Only allow users to delete their own recommendations
      const recommendation = await Recommendation.findOne({
        where: { id, userId }
      });

      if (!recommendation) {
        return res.status(404).json({
          success: false,
          message: 'Recommendation not found'
        });
      }

      await recommendation.destroy();
    } else {
      // Admins can delete any recommendation
      const recommendation = await Recommendation.findByPk(id);
      if (!recommendation) {
        return res.status(404).json({
          success: false,
          message: 'Recommendation not found'
        });
      }

      await recommendation.destroy();
    }

    return res.json({
      success: true,
      message: 'Recommendation deleted successfully'
    });
  } catch (error) {
    console.error('Delete recommendation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete recommendation',
      error: (error as Error).message
    });
  }
};

export default {
  getRecommendations,
  getRecommendationById,
  markAsRead,
  dismissRecommendation,
  recordAction,
  markAllAsRead,
  createRecommendation,
  deleteRecommendation
}; 