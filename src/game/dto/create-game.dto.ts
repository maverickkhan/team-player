import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateGameDto {

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    playerId: number;

    @IsNotEmpty()
    @IsNumber()
    @ApiProperty()
    teamId: number;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty()
    startTime: Date;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty()
    endTime: Date;

}
