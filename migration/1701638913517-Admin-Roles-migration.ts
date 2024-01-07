import { MigrationInterface, QueryRunner } from "typeorm";
import { Role } from "../DB/Entities/Role";
import { Permission } from "../DB/Entities/Permission";
import { Car } from "../DB/Entities/Car";

export class AdminRolesMigration1701638913517 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const admin = new Permission();
    admin.name = "Admin";
    await admin.save();

    const Admin = new Role();
    Admin.roleName = "Admin";
    Admin.permissions = [admin];
    await Admin.save();

    const AdminUser = new Car();
    AdminUser.car_ID = "1";
    AdminUser.email = "201160@ppu.edu.ps";
    AdminUser.password =  "mohammad123M@";
    AdminUser.status = 'active';
    AdminUser.role = Admin;
    await AdminUser.save();

    const x = new Permission();
    x.name = "POST_Car";
    const user = new Role();
    user.roleName = "User";
    await user.save();

    const Manager = new Role();
    Manager.roleName = "Manager";
    Manager.permissions = [ x];
    await Manager.save();
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM Role WHERE roleName = "Admin`);
    await queryRunner.query(`DELETE FROM Role WHERE roleName = "User`);
    await queryRunner.query(`DELETE FROM Role WHERE roleName = "Manager`);
    await queryRunner.query(`DELETE FROM Permission (name) VALUES("Admin")`);
    await queryRunner.query(`DELETE FROM User WHERE car_Id = "1`);
  }
}
