import {
  PrimaryGeneratedColumn,
  Relation,
  ManyToOne,
  Column,
  BaseEntity,
  Entity,
  Timestamp,
} from "typeorm";
import { Car } from "./Car.js";
import { parking } from "./Parking.js";
import { Wallet } from "./Wallet.js";

@Entity()
export class connection extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  start_time = Timestamp;

  @Column()
  end_time = Timestamp;

  @Column()
  cost: number;

  @ManyToOne(() => Car, (car) => car.connections)
  car: Relation<Car>;

  @ManyToOne(() => parking, (parking) => parking.connections)
  parking: Relation<parking>;

  @ManyToOne(() => Wallet, (wallet) => wallet.connections)
  wallet: Relation<Wallet>;
}
