import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  const tableExists = await queryInterface.sequelize.query(`SELECT to_regclass('public.meals') as exists;`, { type:(queryInterface.sequelize as any).QueryTypes.SELECT }) as any[];

  if (!tableExists[0].exists) {
    await queryInterface.createTable('meals', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'user_profiles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      meal_type: {
        type: DataTypes.ENUM('breakfast','brunch','lunch','dinner','snack'),
        allowNull: false,
      },
      logged_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      input_method: {
        type: DataTypes.ENUM('photo','voice','quick_add','same_as_last'),
        allowNull: false,
      },
      location: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      photo_path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      voice_path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      mood_before: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      hunger_level: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ai_status: {
        type: DataTypes.ENUM('pending','processed','error'),
        defaultValue: 'pending',
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  }

  // add logged_at column if missing (old schema)
  const col = await queryInterface.sequelize.query(`SELECT column_name FROM information_schema.columns WHERE table_name='meals' AND column_name='logged_at';`, { type:(queryInterface.sequelize as any).QueryTypes.SELECT }) as any[];
  if (col.length === 0) {
    await queryInterface.addColumn('meals','logged_at',{ type: DataTypes.DATE, allowNull:false, defaultValue: DataTypes.NOW });
  }

  try {
    await queryInterface.addIndex('meals',['user_id','logged_at']);
  } catch(e) {/* ignore */}
}

export async function down(queryInterface: QueryInterface): Promise<void>{
  await queryInterface.dropTable('meals');
} 