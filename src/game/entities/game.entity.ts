import { Player } from "src/player/entities/player.entity";
import { Team } from "src/team/entities/team.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Game extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    playerId: number;

    @JoinColumn({name: 'playerID'})
    @ManyToOne(() => Player)
    player: Player;

    @Column()
    teamId: number;

    @JoinColumn({name: 'teamId'})
    @ManyToOne(() => Team)
    team: Team;

    @Column()
    startTime: Date;

    @Column()
    endTime: Date;

    @Column({default: false})
    isDeleted: boolean;

}
