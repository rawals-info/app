import { sequelize } from './src/config/database';

async function createAdminTables() {
  try {
    console.log('Starting admin tables creation...');
    
    // Try to create enum type
    try {
      console.log('Creating enum type...');
      const result = await sequelize.query("CREATE TYPE \"enum_admin_auths_role\" AS ENUM ('admin', 'staff')");
      console.log('Created enum type result:', result);
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        console.log('Enum type already exists');
      } else {
        console.error('Error creating enum:', error.message);
      }
    }

    // Create admin_auths table
    console.log('Creating admin_auths table...');
    const authsResult = await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "admin_auths" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "email" VARCHAR(255) NOT NULL UNIQUE,
        "password" VARCHAR(255) NOT NULL,
        "role" "enum_admin_auths_role" NOT NULL DEFAULT 'staff',
        "is_email_verified" BOOLEAN DEFAULT false,
        "verification_token" VARCHAR(255),
        "reset_password_token" VARCHAR(255),
        "reset_token_expires_at" TIMESTAMP WITH TIME ZONE,
        "last_login" TIMESTAMP WITH TIME ZONE,
        "login_attempts" INTEGER DEFAULT 0,
        "is_locked" BOOLEAN DEFAULT false,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `);
    console.log('Created admin_auths table result:', authsResult);

    // Create admin_profiles table
    console.log('Creating admin_profiles table...');
    const profilesResult = await sequelize.query(`
      CREATE TABLE IF NOT EXISTS "admin_profiles" (
        "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "auth_id" UUID NOT NULL REFERENCES "admin_auths"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        "first_name" VARCHAR(255) NOT NULL,
        "last_name" VARCHAR(255) NOT NULL,
        "department" VARCHAR(255),
        "position" VARCHAR(255),
        "phone_number" VARCHAR(255),
        "profile_image" VARCHAR(255),
        "permissions" JSON,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
      )
    `);
    console.log('Created admin_profiles table result:', profilesResult);
    
    // Verify tables exist
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('admin_auths', 'admin_profiles')
    `);
    console.log('Tables verification result:', tables);

    console.log('✅ All admin tables created successfully!');
  } catch (error) {
    console.error('Error creating admin tables:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the function
createAdminTables(); 