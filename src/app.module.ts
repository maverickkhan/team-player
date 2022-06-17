import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeOrmConfig } from './config/database.config';
import { TeamModule } from './team/team.module';
import { PlayerModule } from './player/player.module';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    TeamModule,
    PlayerModule,
    GameModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
