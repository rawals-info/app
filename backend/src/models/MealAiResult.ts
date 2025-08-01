import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import Meal from './Meal';

interface MealAiResultAttributes {
  id: string;
  mealId: string;
  provider: string;
  payload: any;
  createdAt: Date;
  updatedAt: Date;
}

type MealAiResultCreationAttributes = Optional<MealAiResultAttributes,'id'|'createdAt'|'updatedAt'>;

interface MealAiResultInstance extends Model<MealAiResultAttributes,MealAiResultCreationAttributes>, MealAiResultAttributes {}

const MealAiResult = sequelize.define<MealAiResultInstance>('MealAiResult',{
  id:{type:DataTypes.UUID,defaultValue:DataTypes.UUIDV4,primaryKey:true},
  mealId:{type:DataTypes.UUID,allowNull:false,field:'meal_id'},
  provider:{type:DataTypes.STRING,allowNull:false},
  payload:{type:DataTypes.JSONB,allowNull:false},
  createdAt:{type:DataTypes.DATE,field:'created_at'},
  updatedAt:{type:DataTypes.DATE,field:'updated_at'},
},{tableName:'meal_ai_results',timestamps:true,underscored:true});

Meal.hasMany(MealAiResult,{foreignKey:'mealId',as:'aiResults'});
MealAiResult.belongsTo(Meal,{foreignKey:'mealId',as:'meal'});

export default MealAiResult; 