import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { getRepositoryToken, InjectConnection } from '@nestjs/typeorm';
import { commonMessage } from 'src/common/messages';
import { ResponseDto } from 'src/common/response.dto';
import { Connection, getRepository } from 'typeorm';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { Team } from './entities/team.entity';

@Injectable()
export class TeamService {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) {}


  async create(createTeamDto: CreateTeamDto): Promise<ResponseDto> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const teamRepo = await queryRunner.manager.getRepository(Team);
      const team = await teamRepo.save(createTeamDto);
      await queryRunner.commitTransaction();
      return { message: commonMessage.create, data: team }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      if(error?.detail == 'Key ("teamName")=(test team) already exists.'){
        throw new BadRequestException(`Team ${createTeamDto.teamName} already exists`);
      }
      throw new InternalServerErrorException(error)
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<ResponseDto> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const teamRepo = await queryRunner.manager.getRepository(Team);
      const teams = await teamRepo.find({
        where: {
          isDeleted: false,
        }
      });
      await queryRunner.commitTransaction();
      return {
        message: commonMessage.get,
        data: teams,
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async findOne(id: number): Promise<ResponseDto> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const teamRepo = await queryRunner.manager.getRepository(Team);
      const teams = await teamRepo.findOne({
        where: {
          id,
          isDeleted: false,
        }
      });
      await queryRunner.commitTransaction();
      return {
        message: commonMessage.get,
        data: teams,
      }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updateTeamDto: UpdateTeamDto) {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const teamRepo = await queryRunner.manager.getRepository(Team);
      const update = await teamRepo.update(
        { id, isDeleted: false },
        updateTeamDto,
      );
      await queryRunner.commitTransaction();
      const team = await teamRepo.findOne({
        where: {
        id,
        isDeleted: false
      }
      })
      return { message: commonMessage.create, data: team }
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      if(error?.detail == `Key ("teamName")=(${updateTeamDto.teamName}) already exists.`){
        throw new BadRequestException(`Team ${updateTeamDto.teamName} already exists`);
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
      const teamRepo = await queryRunner.manager.getRepository(Team);
      const update = await teamRepo.update(
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
