import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Game } from 'src/game/entities/game.entity';
import { Player } from 'src/player/entities/player.entity';
import { Team } from 'src/team/entities/team.entity';

dotenv.config();

const dbConfig = {
  host:
    process.env.TYPE_ORM_DATABASE_HOST ||
    `localhost`,
  port: process.env.TYPE_ORM_DATABASE_PORT || 5432,
  username: process.env.TYPE_ORM_DATABASE_USERNAME || 'postgres',
  password: process.env.TYPE_ORM_DATABASE_PASSWORD || 'abdulhai',
  name: process.env.TYPE_ORM_DATABASE_NAME || `teamplayer-crud`,
};
console.log(dbConfig);

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: dbConfig.host,
  port: +dbConfig.port,
  username: dbConfig.username,
  password: dbConfig.password,
  database: dbConfig.name,
  entities: [
    Team,
    Player,
    Game,
  ],
  synchronize: true,
};
