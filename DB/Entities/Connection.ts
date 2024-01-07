import {
  PrimaryGeneratedColumn,
  Relation,
  ManyToOne,
  Column,
  BaseEntity,
  Entity,
  Timestamp,
} from "typeorm";
import { Car } from "./Car";
import { Parking } from "./Parking";
import { Wallet } from "./Wallet";

@Entity()
export class Connection extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  start_time: Date;

  @Column()
  end_time: Date;

  @Column()
  cost: number;

  @ManyToOne(() => Car, (user) => user.connections)
  car: Relation<Car>;

  @ManyToOne(() => Parking, (parking) => parking.connections, {eager: true})
  parking: Relation<Parking>;

  @ManyToOne(() => Wallet, (wallet) => wallet.connections, {eager:true})
  wallet: Relation<Wallet>;
}
