import { Sequelize } from 'sequelize';
import config from '../config/config.js';

const env = process.env.NODE_ENV || 'production';
const envConfig = config[env];

const sequelize = new Sequelize(
  envConfig.database,
  envConfig.username, 
  envConfig.password,
  {
    ...envConfig,
    define: {
      underscored: true,
    },
  },
);

export const ensureRoleEnumValues = async () => {
  await sequelize.query(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_enum e ON t.oid = e.enumtypid
        WHERE t.typname = 'enum_users_role'
          AND e.enumlabel = 'candidate'
      ) THEN
        ALTER TYPE "enum_users_role" ADD VALUE 'candidate';
      END IF;
    END;
    $$;
  `);
};

export default sequelize;
