import {
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Entity,
} from "typeorm";
import { connection } from "./Connection.js";

@Entity()
export class parking extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  location: string;

  @Column({
    type: "enum",
    enum: ["available", "reserved", "disabled"],
    default: "available",
  })
  status: "available" | "reserved" | "disabled";

  @OneToMany(() => connection, (connection) => connection.parking)
  connections: connection[];
}
