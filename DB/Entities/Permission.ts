import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  Relation,
} from "typeorm";
import { Role } from "./Role.js";

@Entity()
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Relation<Role[]>;
}
