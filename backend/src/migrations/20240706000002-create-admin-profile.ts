import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('admin_profiles', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    auth_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'admin_auths',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: true
    },
    profile_image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: true
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('admin_profiles');
} 