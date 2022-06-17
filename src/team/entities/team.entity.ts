import { Game } from "src/game/entities/game.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Team extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    teamName: string;

    @Column({default: false})
    isDeleted: boolean;

    @OneToMany(() => Game, (game) => game.team)
    game: Game;

}
