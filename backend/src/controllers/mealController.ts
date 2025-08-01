import { Response } from 'express';
import { Op } from 'sequelize';
import { Meal } from '../models';
import { AuthRequest } from '../types';

export const createMeal = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    const { consumedAt, description, carbsGrams } = req.body;

    const meal = await Meal.create({
      userId,
      consumedAt: consumedAt || new Date(),
      description,
      carbsGrams
    });

    return res.status(201).json({ success: true, message: 'Meal logged', data: meal });
  } catch (error: any) {
    console.error('Create meal error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create meal', error: error.message });
  }
};

export const getMeals = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    const { startDate, endDate, limit = '50', offset = '0' } = req.query;
    const where: any = { userId };

    if (startDate && endDate) {
      where.consumedAt = { [Op.between]: [new Date(startDate as string), new Date(endDate as string)] };
    } else if (startDate) {
      where.consumedAt = { [Op.gte]: new Date(startDate as string) };
    } else if (endDate) {
      where.consumedAt = { [Op.lte]: new Date(endDate as string) };
    }

    const result = await Meal.findAndCountAll({
      where,
      order: [['consumedAt', 'DESC']],
      limit: parseInt(limit as string, 10),
      offset: parseInt(offset as string, 10)
    });

    return res.json({ success: true, data: { total: result.count, meals: result.rows } });
  } catch (error: any) {
    console.error('Get meals error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve meals', error: error.message });
  }
};

export const getMealById = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    const { id } = req.params;
    const meal = await Meal.findOne({ where: { id, userId } });
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });

    return res.json({ success: true, data: meal });
  } catch (error: any) {
    console.error('Get meal by ID error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve meal', error: error.message });
  }
};

export const updateMeal = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    const { id } = req.params;
    const { consumedAt, description, carbsGrams } = req.body;

    const meal = await Meal.findOne({ where: { id, userId } });
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });

    await meal.update({
      consumedAt: consumedAt || meal.consumedAt,
      description: description ?? meal.description,
      carbsGrams: carbsGrams ?? meal.carbsGrams
    });

    return res.json({ success: true, message: 'Meal updated', data: meal });
  } catch (error: any) {
    console.error('Update meal error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update meal', error: error.message });
  }
};

export const deleteMeal = async (req: AuthRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Authentication required' });

    const { id } = req.params;
    const meal = await Meal.findOne({ where: { id, userId } });
    if (!meal) return res.status(404).json({ success: false, message: 'Meal not found' });

    await meal.destroy();
    return res.json({ success: true, message: 'Meal deleted' });
  } catch (error: any) {
    console.error('Delete meal error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete meal', error: error.message });
  }
}; 