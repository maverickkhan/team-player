import { Game } from "src/game/entities/game.entity";
import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Player extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column({default: false})
    isDeleted: boolean;

    @OneToMany(() => Game, (game) => game.player)
    game: Game;

}
