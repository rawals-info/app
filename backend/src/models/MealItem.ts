import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Meal from './Meal';
import FoodItem from './FoodItem';

interface MealItemAttributes {
  id: string;
  mealId: string;
  foodItemId: string;
  variantId?: string | null;
  quantity: number;
  unit: 'g'|'ml'|'piece'|'cup'|'tbsp';
  caloriesEst?: number | null;
  giEst?: number | null;
  source: 'user_estimate'|'ai_estimate'|'device';
  createdAt: Date;
  updatedAt: Date;
}

type MealItemCreationAttributes = Optional<MealItemAttributes,'id'|'variantId'|'caloriesEst'|'giEst'|'createdAt'|'updatedAt'>;

interface MealItemInstance extends Model<MealItemAttributes,MealItemCreationAttributes>, MealItemAttributes {}

const MealItem = sequelize.define<MealItemInstance>('MealItem',{
  id:{type:DataTypes.UUID,defaultValue:DataTypes.UUIDV4,primaryKey:true},
  mealId:{type:DataTypes.UUID,allowNull:false,field:'meal_id'},
  foodItemId:{type:DataTypes.UUID,allowNull:false,field:'food_item_id'},
  variantId:{type:DataTypes.UUID,allowNull:true,field:'variant_id'},
  quantity:{type:DataTypes.FLOAT,allowNull:false},
  unit:{type:DataTypes.ENUM('g','ml','piece','cup','tbsp'),allowNull:false},
  caloriesEst:{type:DataTypes.FLOAT,allowNull:true,field:'calories_est'},
  giEst:{type:DataTypes.FLOAT,allowNull:true,field:'gi_est'},
  source:{type:DataTypes.ENUM('user_estimate','ai_estimate','device'),allowNull:false},
  createdAt:{type:DataTypes.DATE,field:'created_at'},
  updatedAt:{type:DataTypes.DATE,field:'updated_at'},
},{tableName:'meal_items',timestamps:true,underscored:true});

Meal.hasMany(MealItem,{foreignKey:'mealId',as:'items'});
MealItem.belongsTo(Meal,{foreignKey:'mealId',as:'meal'});

FoodItem.hasMany(MealItem,{foreignKey:'foodItemId',as:'mealUsages'});
MealItem.belongsTo(FoodItem,{foreignKey:'foodItemId',as:'foodItem'});

export default MealItem; 