import { Response } from 'express';
import { Op } from 'sequelize';
import { HbA1cReading, UserProfile } from '../models';
import { AuthRequest } from '../types';

// Create HbA1c reading
export const createReading = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const userProfile = await UserProfile.findOne({ where: { authId: userId } });
    if (!userProfile) {
      return res.status(400).json({ success: false, message: 'User profile not found' });
    }

    const { value, takenAt, source } = req.body;

    if (!value || isNaN(value)) {
      return res.status(400).json({ success: false, message: 'Value is required and must be numeric' });
    }

    const reading = await HbA1cReading.create({
      userId: userProfile.id,
      value,
      takenAt: takenAt || new Date(),
      source: source || 'manual'
    });

    return res.status(201).json({ success: true, message: 'HbA1c reading recorded', data: reading });
  } catch (error: any) {
    console.error('Create HbA1c error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create HbA1c reading', error: error.message });
  }
};

// Get readings list
export const getReadings = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const userProfile = await UserProfile.findOne({ where: { authId: userId } });
    if (!userProfile) {
      return res.status(400).json({ success: false, message: 'User profile not found' });
    }
    const profileId = userProfile.id;

    const { startDate, endDate, limit = '50', offset = '0' } = req.query;
    const where: any = { userId: profileId };

    if (startDate && endDate) {
      where.takenAt = { [Op.between]: [new Date(startDate as string), new Date(endDate as string)] };
    } else if (startDate) {
      where.takenAt = { [Op.gte]: new Date(startDate as string) };
    } else if (endDate) {
      where.takenAt = { [Op.lte]: new Date(endDate as string) };
    }

    const result = await HbA1cReading.findAndCountAll({
      where,
      order: [['takenAt', 'DESC']],
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10)
    });

    return res.json({ success: true, data: { total: result.count, readings: result.rows } });
  } catch (error: any) {
    console.error('Get HbA1c readings error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve HbA1c readings', error: error.message });
  }
};

// Get by id
export const getReadingById = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    const { id } = req.params;
    const userProfile = await UserProfile.findOne({ where: { authId: userId } });
    if (!userProfile) return res.status(400).json({ success: false, message: 'User profile not found' });
    const profileId = userProfile.id;
    const reading = await HbA1cReading.findOne({ where: { id, userId: profileId } });
    if (!reading) return res.status(404).json({ success: false, message: 'HbA1c reading not found' });

    return res.json({ success: true, data: reading });
  } catch (error: any) {
    console.error('Get HbA1c by ID error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve HbA1c reading', error: error.message });
  }
};

// Update reading
export const updateReading = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    const { id } = req.params;
    const { value, takenAt, source } = req.body;

    const userProfile = await UserProfile.findOne({ where: { authId: userId } });
    if (!userProfile) return res.status(400).json({ success: false, message: 'User profile not found' });
    const profileId = userProfile.id;
    const reading = await HbA1cReading.findOne({ where: { id, userId: profileId } });
    if (!reading) return res.status(404).json({ success: false, message: 'HbA1c reading not found' });

    await reading.update({
      value: value ?? reading.value,
      takenAt: takenAt || reading.takenAt,
      source: source || reading.source
    });

    return res.json({ success: true, message: 'HbA1c reading updated', data: reading });
  } catch (error: any) {
    console.error('Update HbA1c error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update HbA1c reading', error: error.message });
  }
};

// Delete reading
export const deleteReading = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    const { id } = req.params;
    const userProfile = await UserProfile.findOne({ where: { authId: userId } });
    if (!userProfile) return res.status(400).json({ success: false, message: 'User profile not found' });
    const profileId = userProfile.id;
    const reading = await HbA1cReading.findOne({ where: { id, userId: profileId } });
    if (!reading) return res.status(404).json({ success: false, message: 'HbA1c reading not found' });

    await reading.destroy();
    return res.json({ success: true, message: 'HbA1c reading deleted' });
  } catch (error: any) {
    console.error('Delete HbA1c error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete HbA1c reading', error: error.message });
  }
}; 