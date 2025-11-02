import { Sequelize } from 'sequelize';
import config from '../config/config.js';

const env = process.env.NODE_ENV || 'production';
const envConfig = config[env];

const {
  use_env_variable: envVariableKey,
  database,
  username,
  password,
  ...restConfig
} = envConfig;

const buildOptions = () => ({
  ...restConfig,
  define: {
    ...(restConfig.define || {}),
    timestamps: true
  }
});

let sequelize;

if (envVariableKey) {
  const connectionUri =
    process.env[envVariableKey] ||
    process.env.DATABASE_URL ||
    process.env.RENDER_DATABASE_URL;

  sequelize = new Sequelize(connectionUri, buildOptions());
} else {
  sequelize = new Sequelize(database, username, password, buildOptions());
}

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
