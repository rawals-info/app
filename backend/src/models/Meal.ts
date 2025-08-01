import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface MealAttributes {
  id: string;
  userId: string;
  mealType: 'breakfast' | 'brunch' | 'lunch' | 'dinner' | 'snack';
  loggedAt: Date;
  inputMethod: 'photo' | 'voice' | 'quick_add' | 'same_as_last';
  location?: any | null;
  photoPath?: string | null;
  voicePath?: string | null;
  moodBefore?: string | null;
  hungerLevel?: number | null;
  notes?: string | null;
  aiStatus: 'pending' | 'processed' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

interface MealCreationAttributes extends Optional<MealAttributes,'id'|'location'|'photoPath'|'voicePath'|'moodBefore'|'hungerLevel'|'notes'|'aiStatus'|'createdAt'|'updatedAt'> {}

interface MealInstance extends Model<MealAttributes,MealCreationAttributes>, MealAttributes {}

const Meal = sequelize.define<MealInstance>('Meal',{
  id:{type:DataTypes.UUID,defaultValue:DataTypes.UUIDV4,primaryKey:true},
  userId:{type:DataTypes.UUID,allowNull:false,field:'user_id'},
  mealType:{type:DataTypes.ENUM('breakfast','brunch','lunch','dinner','snack'),allowNull:false,field:'meal_type'},
  loggedAt:{type:DataTypes.DATE,allowNull:false,field:'logged_at',defaultValue:DataTypes.NOW},
  inputMethod:{type:DataTypes.ENUM('photo','voice','quick_add','same_as_last'),allowNull:false,field:'input_method'},
  location:{type:DataTypes.JSON,allowNull:true},
  photoPath:{type:DataTypes.STRING,allowNull:true,field:'photo_path'},
  voicePath:{type:DataTypes.STRING,allowNull:true,field:'voice_path'},
  moodBefore:{type:DataTypes.TEXT,allowNull:true,field:'mood_before'},
  hungerLevel:{type:DataTypes.INTEGER,allowNull:true,field:'hunger_level'},
  notes:{type:DataTypes.TEXT,allowNull:true},
  aiStatus:{type:DataTypes.ENUM('pending','processed','error'),defaultValue:'pending',field:'ai_status'},
  createdAt:{type:DataTypes.DATE,field:'created_at'},
  updatedAt:{type:DataTypes.DATE,field:'updated_at'}
},{tableName:'meals',timestamps:true,underscored:true});

export default Meal; 