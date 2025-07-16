


import { QueryInterface, DataTypes } from 'sequelize';


export async function up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('blood_sugar_readings', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
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
      value: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          min: 0
        }
      },
      unit: {
        type: DataTypes.ENUM('mg/dL', 'mmol/L'),
        allowNull: false,
        defaultValue: 'mg/dL'
      },
      reading_datetime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      reading_type: {
        type: DataTypes.ENUM(
          'fasting', 
          'before_meal', 
          'after_meal', 
          'before_exercise',
          'after_exercise', 
          'bedtime', 
          'random', 
          'continuous_monitor'
        ),
        allowNull: false,
        defaultValue: 'random'
      },
      entry_method: {
        type: DataTypes.ENUM('manual', 'device', 'api'),
        allowNull: false,
        defaultValue: 'manual'
      },
      device_info: {
        type: DataTypes.JSON,
        allowNull: true
      },
      meal_relation: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Information about related meal, if applicable'
      },
      medication_relation: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Information about related medication, if applicable'
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      tags: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        defaultValue: []
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });

    // Add index for efficient querying by date range (idempotent)
    await queryInterface.sequelize.query(
      `CREATE INDEX IF NOT EXISTS blood_sugar_readings_user_id_reading_datetime ON blood_sugar_readings (user_id, reading_datetime);`
    );
  }

export async function down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable('blood_sugar_readings');
} 