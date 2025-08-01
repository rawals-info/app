import { Response } from 'express';
import { Op } from 'sequelize';
import { BloodSugarReading, Recommendation, UserProfile, HealthProfile } from '../models';
import { AuthRequest } from '../types';

// Create a new blood sugar reading
export const createReading = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const authId = req.user?.id;
    
    if (!authId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const userProfile = await UserProfile.findOne({ where: { authId } });
    if (!userProfile) {
      return res.status(400).json({
        success: false,
        message: 'User profile not found'
      });
    }
    const userId = userProfile.id;
    
    const { value, unit, readingDateTime, readingType, entryMethod, deviceInfo, notes } = req.body;

    // Create new reading
    const reading = await BloodSugarReading.create({
      userId,
      value,
      unit,
      readingDateTime: readingDateTime || new Date(),
      readingType,
      entryMethod,
      deviceInfo,
      notes
    });

    // Check if reading is out of target range and create recommendation if needed
    await checkBloodSugarLevel(userId, reading);

    return res.status(201).json({
      success: true,
      message: 'Blood sugar reading recorded successfully',
      data: reading
    });
  } catch (error: any) {
    console.error('Create reading error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record blood sugar reading',
      error: error.message
    });
  }
};

// Get all readings for a user with optional filters
export const getReadings = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const authId = req.user?.id;
    
    if (!authId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const userProfile = await UserProfile.findOne({ where: { authId } });
    if (!userProfile) {
      return res.status(400).json({
        success: false,
        message: 'User profile not found'
      });
    }
    const userId = userProfile.id;

    const { startDate, endDate, readingType, limit = 50, offset = 0 } = req.query;

    // Build filter conditions
    const whereConditions: any = { userId };

    // Add date range filter if provided
    if (startDate && endDate) {
      whereConditions.readingDateTime = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
      };
    } else if (startDate) {
      whereConditions.readingDateTime = {
        [Op.gte]: new Date(startDate as string)
      };
    } else if (endDate) {
      whereConditions.readingDateTime = {
        [Op.lte]: new Date(endDate as string)
      };
    }

    // Add reading type filter if provided
    if (readingType) {
      whereConditions.readingType = readingType;
    }

    // Get readings with pagination
    const readings = await BloodSugarReading.findAndCountAll({
      where: whereConditions,
      order: [['readingDateTime', 'DESC']],
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10)
    });

    return res.json({
      success: true,
      data: {
        total: readings.count,
        readings: readings.rows
      }
    });
  } catch (error: any) {
    console.error('Get readings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve blood sugar readings',
      error: error.message
    });
  }
};

// Get a specific reading by ID
export const getReadingById = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const authId = req.user?.id;
    
    if (!authId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const userProfile = await UserProfile.findOne({ where: { authId } });
    if (!userProfile) {
      return res.status(400).json({
        success: false,
        message: 'User profile not found'
      });
    }
    const userId = userProfile.id;

    const { id } = req.params;

    // Find reading
    const reading = await BloodSugarReading.findOne({
      where: { id, userId }
    });

    if (!reading) {
      return res.status(404).json({
        success: false,
        message: 'Blood sugar reading not found'
      });
    }

    return res.json({
      success: true,
      data: reading
    });
  } catch (error: any) {
    console.error('Get reading by ID error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve blood sugar reading',
      error: error.message
    });
  }
};

// Update a reading
export const updateReading = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const authId = req.user?.id;
    
    if (!authId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const userProfile = await UserProfile.findOne({ where: { authId } });
    if (!userProfile) {
      return res.status(400).json({
        success: false,
        message: 'User profile not found'
      });
    }
    const userId = userProfile.id;

    const { id } = req.params;
    const { value, unit, readingDateTime, readingType, notes } = req.body;

    // Find reading
    const reading = await BloodSugarReading.findOne({
      where: { id, userId }
    });

    if (!reading) {
      return res.status(404).json({
        success: false,
        message: 'Blood sugar reading not found'
      });
    }

    // Update reading
    await reading.update({
      value: value || reading.value,
      unit: unit || reading.unit,
      readingDateTime: readingDateTime || reading.readingDateTime,
      readingType: readingType || reading.readingType,
      notes: notes || reading.notes
    });

    // Check if updated reading is out of target range
    await checkBloodSugarLevel(userId, reading);

    return res.json({
      success: true,
      message: 'Blood sugar reading updated successfully',
      data: reading
    });
  } catch (error: any) {
    console.error('Update reading error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update blood sugar reading',
      error: error.message
    });
  }
};

// Delete a reading
export const deleteReading = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const authId = req.user?.id;
    
    if (!authId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const userProfile = await UserProfile.findOne({ where: { authId } });
    if (!userProfile) {
      return res.status(400).json({
        success: false,
        message: 'User profile not found'
      });
    }
    const userId = userProfile.id;

    const { id } = req.params;

    // Find reading
    const reading = await BloodSugarReading.findOne({
      where: { id, userId }
    });

    if (!reading) {
      return res.status(404).json({
        success: false,
        message: 'Blood sugar reading not found'
      });
    }

    // Delete reading
    await reading.destroy();

    return res.json({
      success: true,
      message: 'Blood sugar reading deleted successfully'
    });
  } catch (error: any) {
    console.error('Delete reading error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete blood sugar reading',
      error: error.message
    });
  }
};

// Get statistics for blood sugar readings
export const getStatistics = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const authId = req.user?.id;
    
    if (!authId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }
    
    const userProfile = await UserProfile.findOne({ where: { authId } });
    if (!userProfile) {
      return res.status(400).json({
        success: false,
        message: 'User profile not found'
      });
    }
    const userId = userProfile.id;

    const { period = '7days' } = req.query;
    
    // Calculate date range based on period
    const endDate = new Date();
    let startDate = new Date();
    
    switch (period) {
      case '24hours':
        startDate.setDate(endDate.getDate() - 1);
        break;
      case '7days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(endDate.getDate() - 90);
        break;
      default:
        startDate.setDate(endDate.getDate() - 7);
    }
    
    // Get all readings in the date range
    const readings = await BloodSugarReading.findAll({
      where: {
        userId,
        readingDateTime: {
          [Op.between]: [startDate, endDate]
        }
      },
      order: [['readingDateTime', 'ASC']]
    });
    
    // Calculate statistics
    let stats = {
      count: readings.length,
      average: 0,
      min: 0,
      max: 0,
      inTargetRange: 0,
      belowTarget: 0,
      aboveTarget: 0,
      byReadingType: {} as Record<string, any>,
      byDay: {} as Record<string, any>
    };
    
    if (readings.length > 0) {
      // Get target range from the user's health profile (fallback to defaults)
      const hp = await HealthProfile.findOne({ where: { userId } });
      const targetMin = hp?.targetBloodSugarMin ?? 70;
      const targetMax = hp?.targetBloodSugarMax ?? 180;
      
      // Calculate basic stats
      let sum = 0;
      let min = readings[0].value;
      let max = readings[0].value;
      let inRange = 0;
      let below = 0;
      let above = 0;
      
      // Group by reading type
      let byType: Record<string, any> = {};
      
      // Group by day
      let byDay: Record<string, any> = {};
      
      readings.forEach(reading => {
        // Convert to mg/dL if needed for consistent calculations
        let value = reading.value;
        if (reading.unit === 'mmol/L') {
          value = value * 18; // Convert mmol/L to mg/dL
        }
        
        // Update basic stats
        sum += value;
        min = Math.min(min, value);
        max = Math.max(max, value);
        
        // Check if in target range
        if (value < targetMin) {
          below++;
        } else if (value > targetMax) {
          above++;
        } else {
          inRange++;
        }
        
        // Group by reading type
        const type = reading.readingType;
        if (!byType[type]) {
          byType[type] = {
            count: 0,
            sum: 0,
            values: []
          };
        }
        byType[type].count++;
        byType[type].sum += value;
        byType[type].values.push(value);
        
        // Group by day
        const day = reading.readingDateTime.toISOString().split('T')[0];
        if (!byDay[day]) {
          byDay[day] = {
            count: 0,
            sum: 0,
            values: []
          };
        }
        byDay[day].count++;
        byDay[day].sum += value;
        byDay[day].values.push(value);
      });
      
      // Calculate averages for each group
      Object.keys(byType).forEach(type => {
        byType[type].average = byType[type].sum / byType[type].count;
      });
      
      Object.keys(byDay).forEach(day => {
        byDay[day].average = byDay[day].sum / byDay[day].count;
      });
      
      // Update stats object
      stats.average = sum / readings.length;
      stats.min = min;
      stats.max = max;
      stats.inTargetRange = inRange;
      stats.belowTarget = below;
      stats.aboveTarget = above;
      stats.byReadingType = byType;
      stats.byDay = byDay;
    }
    
    return res.json({
      success: true,
      data: stats
    });
  } catch (error: any) {
    console.error('Get statistics error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve blood sugar statistics',
      error: error.message
    });
  }
};

// Helper function to check blood sugar level and create recommendations
const checkBloodSugarLevel = async (userId: string, reading: any): Promise<void> => {
  try {
    // Get target range from health profile
    const hp = await HealthProfile.findOne({ where: { userId } });
    if (!hp) return;
    
    const targetMin = hp.targetBloodSugarMin ?? 70;
    const targetMax = hp.targetBloodSugarMax ?? 180;
    
    // Convert to mg/dL if needed for consistent comparison
    let value = reading.value;
    if (reading.unit === 'mmol/L') {
      value = value * 18; // Convert mmol/L to mg/dL
    }
    
    // Check if blood sugar is out of range
    if (value < targetMin) {
      // Create low blood sugar recommendation
      await Recommendation.create({
        userId,
        type: 'alert',
        priority: 'high',
        title: 'Low Blood Sugar Detected',
        description: `Your blood sugar reading of ${reading.value} ${reading.unit} is below your target range.`,
        suggestedAction: 'Consider consuming 15-20 grams of fast-acting carbohydrates, such as juice or glucose tablets.',
        triggerType: 'blood_sugar_low',
        triggerValue: {
          readingId: reading.id,
          value: reading.value,
          unit: reading.unit,
          targetMin
        },
        triggerDateTime: new Date()
      });
    } else if (value > targetMax) {
      // Create high blood sugar recommendation
      await Recommendation.create({
        userId,
        type: 'alert',
        priority: 'medium',
        title: 'High Blood Sugar Detected',
        description: `Your blood sugar reading of ${reading.value} ${reading.unit} is above your target range.`,
        suggestedAction: 'Consider drinking water and taking a short walk. Check your blood sugar again in 1-2 hours.',
        triggerType: 'blood_sugar_high',
        triggerValue: {
          readingId: reading.id,
          value: reading.value,
          unit: reading.unit,
          targetMax
        },
        triggerDateTime: new Date()
      });
    }
  } catch (error) {
    console.error('Error checking blood sugar level:', error);
  }
}; 