import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { commonMessage } from 'src/common/messages';
import { Connection } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from './entities/player.entity';

@Injectable()
export class PlayerService {
  constructor(

    @InjectConnection()
    private readonly connection: Connection,

  ){}

  async create(createPlayerDto: CreatePlayerDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const playerRepo = await queryRunner.manager.getRepository(Player);
      const player = await playerRepo.save(createPlayerDto);
      await queryRunner.commitTransaction();
      return { message: commonMessage.create, data: player }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      if(error?.detail == `Key ("name")=(${createPlayerDto.name}) already exists.`){
        throw new BadRequestException(`Player ${createPlayerDto.name} already exists`);
      }
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
      const playerRepo = await queryRunner.manager.getRepository(Player);
      const player = await playerRepo.find({
        where: {
          isDeleted: false,
        }
      });
      await queryRunner.commitTransaction();
      return {
        message: commonMessage.get,
        data: player,
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
      const playerRepo = await queryRunner.manager.getRepository(Player);
      const player = await playerRepo.findOne({
        where: {
          id,
          isDeleted: false,
        }
      });
      await queryRunner.commitTransaction();
      return {
        message: commonMessage.get,
        data: player,
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const playerRepo = await queryRunner.manager.getRepository(Player);
      const update = await playerRepo.update(
        { id, isDeleted: false },
        updatePlayerDto,
      );
      await queryRunner.commitTransaction();
      const player = await playerRepo.findOne({
        where: {
        id,
        isDeleted: false
      }
      })
      return { message: commonMessage.create, data: player }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      if(error?.detail == `Key ("name")=(${updatePlayerDto.name}) already exists.`){
        throw new BadRequestException(`plyaer ${updatePlayerDto.name} already exists`);
      }
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
      const playerRepo = await queryRunner.manager.getRepository(Player);
      const update = await playerRepo.update(
        { id, isDeleted: false },
        { isDeleted: true },
      );
      await queryRunner.commitTransaction();
      return { message: commonMessage.delete, data: 'deleted' }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error)
    } finally {
      await queryRunner.release();
    }
  }
}
