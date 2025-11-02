import {
  MariaDbDriver,
  Options,
  UnderscoreNamingStrategy,
} from '@mikro-orm/mariadb';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';

export const microOrmConfig: Options = {
  driver: MariaDbDriver,
  host: process.env.DATABASE_HOST!,
  port: parseInt(process.env.DATABASE_PORT!),
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  dbName: process.env.DATABASE_NAME!,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  namingStrategy: UnderscoreNamingStrategy,
  debug: process.env.NODE_ENV !== 'production',
  seeder: {
    path: './src/database/seeders',
  },
  serialization: {
    forceObject: true,
  },
  allowGlobalContext: true,
  highlighter:
    process.env.NODE_ENV !== 'production' ? new SqlHighlighter() : undefined,
};
