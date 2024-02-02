import express from "express";
import { Connection } from "../DB/Entities/Connection";
import dataSource from "../DB/dataSource";
import { Parking } from "../DB/Entities/Parking";
import { Car } from "../DB/Entities/Car";
import jwt from "jsonwebtoken";
import { Wallet } from "../DB/Entities/Wallet";
import { GetAll } from "../@types";

const startConnection = async (req: express.Request, res: express.Response) => {
  try {
    //get the carid from the token
    const decoded = jwt.decode(req.headers["authorization"] || "", {
      json: true,
    });
    const car = await Car.findOneBy({ id: decoded?.userId });
    //get the parking from the req.body
    const parking = await Parking.findOneBy({ customid: req.body.parkingId });

    const querryRunner = dataSource.createQueryRunner();
    await querryRunner.connect();
    await querryRunner.startTransaction();
    try {
      const connection = new Connection();

      if (parking) {
        connection.parking = parking;
        parking.status = "reserved";
        await parking.save();
      } else throw "parking not found";
      if (car) {
        connection.car = car;
        const wallet = car?.wallet;
        if (!wallet) throw "No wallet for this car!";
        connection.wallet = wallet;
        await wallet.save();
        await car.save();
      } else throw "car not found";

      connection.status = "active";
      connection.start_time = new Date();
      await connection.save();
      return res.status(201).json({
        statusCode: 201,
        message: "Created",
        data: "Parking reserved Successfully!",
      });
    } catch (error) {
      await querryRunner.rollbackTransaction();
      return res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        data: `Failed To Reserve The Parking ${error}`,
      });
    } finally {
      await querryRunner.release();
    }
  } catch (err) {
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      data: `Failed To Reserve The Parking ${err}`,
    });
  }
};

export { startConnection };
