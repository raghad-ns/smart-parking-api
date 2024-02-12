import express from "express";
import { Car } from "../DB/Entities/Car";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { passwordMatched } from "./password";
import { Role } from "../DB/Entities/Role";
import { Wallet } from "../DB/Entities/Wallet";
import { In } from "typeorm";
import { logger, secureLog } from "../log";
import { user } from "../@types";
import { Connection } from "../DB/Entities/Connection";

const user = (car: Car): user => {
  const parking: Connection[] | null = car.connections?.filter((conn) => {
    if (conn.status === "active") return conn;
  });
  let user: user = {
    carID: car.car_ID ? car.car_ID : null,
    wallet: {
      id: car.wallet ? car.wallet.id : null,
      amount: car.wallet ? car.wallet.amount : null,
    },
    email: car.email ? car.email : null,
    owner: car.owner ? car.owner : null,
    connection: parking?.length > 0 ? parking[0] : null,
    role: { roleName: car.role.roleName },
    token: car.token ? car.token : null,
  };

  return user;
};

const insertCar = async (req: express.Request, res: express.Response) => {
  try {
    const { Owner, Car_Id, Email, Password } = req.body;
    var car = new Car();
    car.owner = Owner;
    car.car_ID = Car_Id;
    car.email = Email;
    let role = await Role.findOneBy({ roleName: "User" });
    if (role !== null) {
      car.role = role;
    } else {
      res.status(401).json({
        statusCode: 401,
        message: "Error adding car while finding the role",
        data: {},
      });
    }
    let wallet = new Wallet();
    car.wallet = wallet;
    await wallet.save();
    await car.save();
    const payload = {
      email: car.email,
      id: car.id,
    };
    const secret = process.env.PASSWORD_SECRET + car.id;
    const token = jwt.sign(payload, secret, { expiresIn: "15m" });
    const link = `https://localhost:${process.env.PORT}/home/set-password/${car.id}/${token}`;
    res.status(201).json({
      statusCode: 201,
      message: "User has been add Successfully",
      data: { passwordLink: link, car: user(car) },
    });
  } catch (error) {
    console.log(error);
    throw `${error}`;
  }
};

const setPassword = async (req: express.Request, res: express.Response) => {
  try {
    const { id, token } = req.params;
    const { Password, Confirm_Password } = req.body;
    if (!id || !token) {
      throw "invalid link";
    }
    if (!Password || !Confirm_Password) {
      throw "Invalid credintioals";
    } else {
      const car = await Car.findOneBy({ id: id });
      if (car === null) {
        throw "invalid id...";
        return;
      }
      const secret = process.env.PASSWORD_SECRET + car.id;
      const decode = jwt.decode(token, { json: true });
      if ((decode as any)?.exp <= Date.now() / 1000) {
        secureLog("info", `set passwrod with expired link: ${id}`);
        return res.status(401).json({
          statusCode: 401,
          message: "password link has expired!",
          data: {},
        });
      }
      const payload = jwt.verify(token, secret);
      if (payload) {
        if (decode !== null && decode.id === car.id) {
          if (car.status === "inactive") {
            const passwordSt = passwordMatched(Password, Confirm_Password);
            if (passwordSt === true) {
              car.password = await bcrypt.hash(Password, 10);
              car.status = "active";
              await car.save();
            } else {
              throw `${passwordSt}`;
            }
          } else throw "password already set";
        } else {
          throw "invalid token";
        }
      } else {
        throw "invalid token";
      }
    }
  } catch (error) {
    throw error;
  }
};

const insertManager = async (req: express.Request, res: express.Response) => {
  try {
    const { Email, Name } = req.body;
    let car = new Car();
    car.email = Email;
    car.owner = Name;
    let role = await Role.findOneBy({ roleName: "Manager" });
    if (role !== null) {
      car.role = role;
    } else {
      logger.error(`Manager role dosen't exist`);
      res.status(400).json({
        statusCode: 400,
        message: "Error adding Manager while finding the role",
        data: {},
      });
    }
    await car.save();
    const payload = {
      email: car.email,
      id: car.id,
    };
    const secret = process.env.PASSWORD_SECRET + car.email;
    const token = jwt.sign(payload, secret, { expiresIn: "5m" });
    console.log("insert manager");

    const link = `https://localhost:${process.env.PORT}/home/set-manager-password/${car.email}/${token}`;
    secureLog(
      "info",
      `new manager  added with email ${Email} and send a mail to set password : ${link}`
    );
    res.status(201).json({
      statusCode: 201,
      message: "Manager added successfully",
      data: { manager: car, passwordLink: link },
    });
  } catch (error) {
    logger.error(`Internal server error while adding new manager: ${error}`);
    res.status(500).json({
      statusCode: 500,
      message: `Internal server Error: ${error}`,
      data: {},
    });
  }
};

const setManagerPassword = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, token } = req.params;
    if (!email || !token) {
      throw "invalid link";
    }
    const { Password, Confirm_Password } = req.body;
    const car = await Car.findOneBy({ email: email });
    if (car === null) {
      throw "invalid link...";
      return;
    }
    const secret = process.env.PASSWORD_SECRET + car.email;
    const decode = jwt.decode(token, { json: true });
    if ((decode as any)?.exp <= Date.now() / 1000) {
      secureLog("info", `password link has expired: ${email}`);
      return res.status(401).json({
        statusCode: 401,
        message: "password link has expires!",
        data: {},
      });
    }
    const payload = jwt.verify(token, secret);
    if (payload) {
      if (decode !== null && decode.id === car.id) {
        if (car.status === "inactive") {
          const passwordSt = passwordMatched(Password, Confirm_Password);
          if (passwordSt === true) {
            car.password = await bcrypt.hash(Password, 10);
            car.status = "active";
            await car.save();
          } else {
            throw `${passwordSt}`;
          }
        } else throw "password already set";
      } else {
        throw "invalid token";
      }
    } else {
      throw "invalid token";
    }
  } catch (error) {
    throw error;
  }
};

const managerLogin = async (email: string, password: string) => {
  try {
    const [car, count] = await Car.findAndCount({
      relations: { role: true },
      where: {
        email: email,
        role: { roleName: In(["Manager", "Admin"]) },
        status: "active",
      },
    });
    let x: Car = new Car();
    x = car[0];
    if (x.email === "" || null) {
      throw "invalid credintials";
    }
    const manager: Car = x;

    const passwordMatching = await bcrypt.compare(
      password,
      manager?.password || ""
    );

    if (car !== null && passwordMatching) {
      const token = jwt.sign(
        { userId: manager.id, email: manager.email },
        process.env.PASSWORD_SECRET || "",
        { expiresIn: "2h", allowInsecureKeySizes: false }
      );
      manager.token = token;
      await manager.save();
      return { token, car: manager };
    } else {
      throw "Invalid Username or password!";
    }
  } catch (error) {
    throw "Invalid Username or password!";
  }
};

const userLogin = async (id: string, password: string) => {
  try {
    const car = await Car.findOneBy({ car_ID: id });

    if (car !== null) {
      const passwordMatching = await bcrypt.compare(
        password,
        car?.password || ""
      );

      if (car !== null && passwordMatching) {
        const token = jwt.sign(
          { userId: car.id, email: car.email },
          process.env.PASSWORD_SECRET || "",
          { expiresIn: "2h" }
        );
        car.token = token;
        await car.save();
        return { token, car };
      } else {
        throw "Invalid Username or password!";
      }
    } else throw "car dosn't exist or the password not set";
  } catch (error) {
    throw "Invalid Username or password!";
  }
};

export {
  insertCar,
  setPassword,
  insertManager,
  setManagerPassword,
  managerLogin,
  userLogin,
  user,
};
