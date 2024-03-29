import { MigrationInterface, QueryRunner } from "typeorm";
import { Role } from "../DB/Entities/Role";
import { Permission } from "../DB/Entities/Permission";
import { Car } from "../DB/Entities/Car";
import { Wallet } from "../DB/Entities/Wallet";

export class AdminRolesMigration1701638913517 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //admin permission
    const admin = new Permission();
    admin.name = "Admin";
    await admin.save();
    //admin Role
    const Admin = new Role();
    Admin.roleName = "Admin";
    Admin.permissions = [admin];
    await Admin.save();

    //admin User
    const AdminUser = new Car();
    AdminUser.car_ID = "1";
    AdminUser.email = "201160@ppu.edu.ps";
    AdminUser.password = "mohammad123M@";
    AdminUser.status = "active";
    AdminUser.role = Admin;
    AdminUser.wallet = new Wallet();
    await AdminUser.wallet.save();
    await AdminUser.save();
//car permissions
    const x = new Permission();
    x.name = "POST_car";
    await x.save()

    //parking permissions
    const getPark = new Permission();
    getPark.name = "GET_parkings";
    await getPark.save()

    const postPark = new Permission();
    postPark.name = "POST_parking";
    await postPark.save();

    //reflect permissions
    const postRe = new Permission();
    postRe.name = "POST_Reflect";
    await postRe.save();
    const getRe = new Permission();
    getRe.name = "GET_ALL_Reflect";
    await getRe.save();
    //transaction permission
    const getTran = new Permission ();
    getTran.name = "GET_Transaction";
    await getTran.save();
    //user Role
    const user = new Role();
    user.roleName = "User";
    user.permissions = [getPark, getTran];
    await user.save();
    //manager Role
    const Manager = new Role();
    Manager.roleName = "Manager";
    Manager.permissions = [x, postPark];
    await Manager.save();
    //update role permission
    Admin.permissions = [...Admin.permissions, postRe, getRe]
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM Role WHERE roleName = "Admin`);
    await queryRunner.query(`DELETE FROM Role WHERE roleName = "User`);
    await queryRunner.query(`DELETE FROM Role WHERE roleName = "Manager`);
    await queryRunner.query(`DELETE FROM Permission (name) VALUES("Admin")`);
    await queryRunner.query(`DELETE FROM User WHERE car_Id = "1`);
  }
}
