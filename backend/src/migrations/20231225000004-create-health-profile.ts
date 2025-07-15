


import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('health_profiles', {
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
    diabetes_type: {
      type: DataTypes.ENUM('type1', 'type2', 'gestational', 'prediabetes', 'other'),
      allowNull: true
    },
    diagnosis_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    weight_unit: {
      type: DataTypes.ENUM('kg', 'lb'),
      defaultValue: 'kg'
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    height_unit: {
      type: DataTypes.ENUM('cm', 'ft'),
      defaultValue: 'cm'
    },
    target_blood_sugar_min: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 70
    },
    target_blood_sugar_max: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 180
    },
    blood_sugar_unit: {
      type: DataTypes.ENUM('mg/dL', 'mmol/L'),
      defaultValue: 'mg/dL'
    },
    medications: {
      type: DataTypes.JSON,
      allowNull: true
    },
    allergies: {
      type: DataTypes.JSON,
      allowNull: true
    },
    medical_conditions: {
      type: DataTypes.JSON,
      allowNull: true
    },
    family_history: {
      type: DataTypes.JSON,
      allowNull: true
    },
    lifestyle: {
      type: DataTypes.JSON,
      allowNull: true
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
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('health_profiles');
} 