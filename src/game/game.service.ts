import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { commonMessage } from 'src/common/messages';
import { Brackets, Connection } from 'typeorm';
import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(

    @InjectConnection()
    private readonly connection: Connection,

  ) { }

  async create(createGameDto: CreateGameDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const gameRepo = await queryRunner.manager.getRepository(Game);
      const exist = await gameRepo.createQueryBuilder('game')
        .where('game.isDeleted = false')
        .andWhere('game.startTime BETWEEN :startTime AND :endTime', { startTime: createGameDto.startTime, endTime: createGameDto.endTime })
        .andWhere('game.playerId = :playerId', { playerId: createGameDto.playerId })
        .getOne();
      if (exist) {
        throw new BadRequestException('Player already reserved for a game at the given time');
      }
      const exist2 = await gameRepo.createQueryBuilder('game')
        .where('game.isDeleted = false')
        .andWhere('game.endTime BETWEEN :startTime AND :endTime', { startTime: createGameDto.startTime, endTime: createGameDto.endTime })
        .andWhere('game.playerId = :playerId', { playerId: createGameDto.playerId })
        .getOne();
      if (exist2) {
        throw new BadRequestException('Player already reserved for a game at the given time');
      }
      const creation = await gameRepo.save(createGameDto);
      const game = await gameRepo.createQueryBuilder('game')
        .where('game.id = :id', { id: creation.id })
        .andWhere('game.isDeleted = false')
        .leftJoinAndSelect('game.team', 'team')
        .leftJoinAndSelect('game.player', 'player')
        .getOne();
      await queryRunner.commitTransaction();
      return { message: commonMessage.create, data: game }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error)
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const gameRepo = await queryRunner.manager.getRepository(Game);
      const games = await gameRepo.createQueryBuilder('game')
        .where('game.isDeleted = false')
        .leftJoinAndSelect('game.team', 'team')
        .leftJoinAndSelect('game.player', 'player')
        .getMany();
      await queryRunner.commitTransaction();
      return {
        message: commonMessage.get,
        data: games,
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const gameRepo = await queryRunner.manager.getRepository(Game);
      const games = await gameRepo.createQueryBuilder('game')
        .where('game.isDeleted = false')
        .andWhere('game.id = :id', { id })
        .leftJoinAndSelect('game.team', 'team')
        .leftJoinAndSelect('game.player', 'player')
        .getMany();
      await queryRunner.commitTransaction();
      return {
        message: commonMessage.get,
        data: games,
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const gameRepo = await queryRunner.manager.getRepository(Game);
      const qb = await gameRepo.createQueryBuilder('game')
        .where('game.isDeleted = false')
      if (updateGameDto?.playerId) {
        qb.andWhere('game.playerId = :playerId', { playerId: updateGameDto?.playerId })

        if (updateGameDto?.startTime) {
          qb.andWhere('game.startTime < :startTime', { startTime: updateGameDto?.startTime })
        }
        if (updateGameDto?.endTime) {
          qb.andWhere('game.endTime > :endTime', { endTime: updateGameDto?.endTime })
        }
      }
      const exist = qb.getOne();
      if (exist) {
        throw new BadRequestException('Player already reserved for a game at the given time');
      }
      const update = await gameRepo.update(id, updateGameDto);
      const game = await gameRepo.createQueryBuilder('game')
        .where('game.id = :id', { id })
        .andWhere('game.isDeleted = false')
        .leftJoinAndSelect('game.team', 'team')
        .leftJoinAndSelect('game.player', 'player')
        .getOne();
      await queryRunner.commitTransaction();
      return { message: commonMessage.create, data: game }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error)
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const gameRepo = await queryRunner.manager.getRepository(Game);
      const update = await gameRepo.update(id, { isDeleted: false });
      await queryRunner.commitTransaction();
      return { message: commonMessage.create, data: 'deleted' }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error)
    } finally {
      await queryRunner.release();
    }
  }
}
