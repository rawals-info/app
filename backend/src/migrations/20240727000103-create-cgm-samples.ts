import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('cgm_samples', {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    device_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'cgm_devices',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
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
      allowNull: false
    },
    unit: {
      type: DataTypes.ENUM('mg/dL', 'mmol/L'),
      allowNull: false,
      defaultValue: 'mg/dL'
    },
    sampled_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
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
    `CREATE INDEX IF NOT EXISTS cgm_samples_user_id_sampled_at ON cgm_samples (user_id, sampled_at);`
  );
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('cgm_samples');
} 