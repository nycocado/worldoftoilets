import {
  MariaDbDriver,
  Options,
  UnderscoreNamingStrategy,
} from '@mikro-orm/mariadb';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { ConfigService } from '@nestjs/config';

export const createMikroOrmConfig = (config: ConfigService): Options => {
  return {
    driver: MariaDbDriver,
    host: config.getOrThrow('DATABASE_HOST'),
    port: parseInt(config.getOrThrow('DATABASE_PORT')),
    user: config.getOrThrow('DATABASE_USER'),
    password: config.getOrThrow('DATABASE_PASSWORD'),
    dbName: config.getOrThrow('DATABASE_NAME'),
    entities: ['dist/**/*.entity.js'],
    entitiesTs: ['src/**/*.entity.ts'],
    namingStrategy: UnderscoreNamingStrategy,
    debug: config.getOrThrow('NODE_ENV') !== 'production',
    seeder: {
      path: './src/database/seeders',
    },
    serialization: {
      forceObject: true,
    },
    allowGlobalContext: true,
    highlighter:
      config.getOrThrow('NODE_ENV') !== 'production'
        ? new SqlHighlighter()
        : undefined,
  };
};
