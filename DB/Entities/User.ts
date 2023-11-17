import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  OneToOne,
  OneToMany,
  ManyToOne,
  Relation,
  PrimaryGeneratedColumn,
} from "typeorm";
import bcrypt from "bcrypt";
import { Wallet } from "./Wallet.js";
import { connection } from "./Connection.js";
import { Role } from "./Role.js";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  car_id: string;

  @Column({ nullable: false })
  email: string;

  @Column()
  owner: string;

  @Column({ type: "enum", enum: ["inactive", "active"], default: "inactive" })
  status: String;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
  @Column({ nullable: false })
  password: string;

  @OneToOne(() => Wallet)
  wallet: Relation<Wallet>;

  @OneToMany(() => connection, (connection) => connection.car)
  connections: Relation<connection[]>;

  @ManyToOne(() => Role, (role) => role.cars)
  role: Relation<Role>;
}
