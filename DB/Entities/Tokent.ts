import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Token extends BaseEntity{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column('text')
    token: string;

}