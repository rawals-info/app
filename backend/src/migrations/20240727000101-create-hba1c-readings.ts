import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('hba1c_readings', {
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
      validate: { min: 3, max: 20 }
    },
    unit: {
      type: DataTypes.ENUM('percent'),
      allowNull: false,
      defaultValue: 'percent'
    },
    taken_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    source: {
      type: DataTypes.ENUM('manual', 'lab_report'),
      allowNull: false,
      defaultValue: 'manual'
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

  await queryInterface.sequelize.query(
    `CREATE INDEX IF NOT EXISTS hba1c_readings_user_id_taken_at ON hba1c_readings (user_id, taken_at);`
  );
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('hba1c_readings');
} 