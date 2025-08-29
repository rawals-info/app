import { Response } from 'express';
import { Meal, MealItem } from '../models';
import { AuthRequest } from '../types';

export const createMeal = async (req: AuthRequest, res: Response) => {
  try {
    const authId = req.user?.id;
    if (!authId) return res.status(401).json({ success:false, message:'Authentication required' });

    const { mealType, loggedAt, inputMethod, location, moodBefore, hungerLevel, notes } = req.body;

    const meal = await Meal.create({
      userId: authId,
      mealType,
      loggedAt: loggedAt || new Date(),
      inputMethod,
      location,
      moodBefore,
      hungerLevel,
      notes,
    });

    return res.status(201).json({ success:true, data: meal });
  } catch (error:any) {
    console.error('Create meal error', error);
    return res.status(500).json({ success:false, message:'Failed', error:error.message });
  }
};

export const getMeals = async (req: AuthRequest, res: Response) => {
  try {
    const authId = req.user?.id;
    if (!authId) return res.status(401).json({ success:false, message:'Authentication required' });
    const meals = await Meal.findAll({ where:{ userId: authId }, order:[['loggedAt','DESC']], include:[{ model: MealItem, as:'items'}] });
    return res.json({ success:true, data: meals });
  } catch (error:any) {
    return res.status(500).json({ success:false, message:error.message });
  }
};

export const getMealById = async (req: AuthRequest, res: Response) => {
  try {
    const authId = req.user?.id;
    const { id } = req.params;
    const meal = await Meal.findOne({ where:{ id, userId: authId }, include:[{ model: MealItem, as:'items'}] });
    if (!meal) return res.status(404).json({ success:false, message:'Not found' });
    return res.json({ success:true, data: meal });
  } catch (e:any) { return res.status(500).json({ success:false, message:e.message }); }
};

export const updateMeal = async (req: AuthRequest, res: Response) => {
  try {
    const authId = req.user?.id; const { id } = req.params;
    const meal = await Meal.findOne({ where:{ id, userId: authId } });
    if (!meal) return res.status(404).json({ success:false, message:'Not found' });
    await meal.update(req.body);
    return res.json({ success:true, data: meal });
  } catch (e:any) { return res.status(500).json({ success:false, message:e.message }); }
};

export const deleteMeal = async (req: AuthRequest, res: Response) => {
  try {
    const authId = req.user?.id; const { id } = req.params;
    const meal = await Meal.findOne({ where:{ id, userId: authId } });
    if (!meal) return res.status(404).json({ success:false, message:'Not found' });
    await meal.destroy();
    return res.json({ success:true, message:'Deleted' });
  } catch (e:any) { return res.status(500).json({ success:false, message:e.message }); }
}; 