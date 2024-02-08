import express from "express";
import { Connection } from "../DB/Entities/Connection";
import dataSource from "../DB/dataSource";
import { Parking } from "../DB/Entities/Parking";
import { Car } from "../DB/Entities/Car";
import jwt from "jsonwebtoken";
import { Wallet } from "../DB/Entities/Wallet";
import { GetAll, hestory } from "../@types";
import { logger, secureLog } from "../log";

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
      secureLog("info", `new connection started successfully: ${connection}`);
      return res.status(201).json({
        statusCode: 201,
        message: "Created",
        data: "Parking reserved Successfully!",
      });
    } catch (error) {
      logger.error(`Error in starting a connection ${error}`);
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
    logger.error(`An error occurred while creating a connection: ${err}`);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      data: `Failed To Reserve The Parking ${err}`,
    });
  }
};

function calculateMinutesDifference(
  timestamp1: number,
  timestamp2: number
): number {
  const date1 = new Date(timestamp1);
  const date2 = new Date(timestamp2);

  // Calculate the difference in milliseconds
  const timeDifference = Math.abs(date2.getTime() - date1.getTime());

  // Convert the difference to minutes
  const minutesDifference = timeDifference / (1000 * 60);

  return minutesDifference;
}

const charge = async (wallet: Wallet, amount: number) => {
  const admin = await Car.findOne({
    where: { role: { roleName: "Admin" } },
  });
  if (!admin) {
    //log files
    logger.error(`Admin user not found`);
    return {
      statusCode: 500,
      message: "Internal Server Error",
      data: `Failed To charge the car for parking `,
    };
  }
  const adminWallet = admin?.wallet;
  const querryRunner = dataSource.createQueryRunner();
  await querryRunner.connect();
  await querryRunner.startTransaction();
  try {
    adminWallet.amount += amount;
    wallet.amount -= amount;
    await wallet.save();
    await adminWallet.save();
    await querryRunner.commitTransaction();
    secureLog("info", `Successfully charged ${amount}$ from car to admin`);
  } catch (error) {
    logger.error(`Error while charging ${error}`);
    await querryRunner.rollbackTransaction();
  } finally {
    await querryRunner.release();
  }
};

const endConnection = async (req: express.Request, res: express.Response) => {
  const decode = jwt.decode(req.headers["authorization"] || "", { json: true });
  const connection = await Connection.findOne({
    relations: {
      car: true,
    },
    where: {
      car: {
        id: decode?.userId,
      },
      status: "active",
    },
  });
  if (!connection) {
    secureLog(
      "info",
      `trying to end connection: No active connection found for user with ID :${decode?.userId}`
    );
    return res.status(404).json({
      statusCode: 404,
      message: "Not Found",
      data: "No Active Connection Found For This User.",
    });
  } else {
    try {
      const wallet = connection.wallet;
      const parking = connection.parking;
      parking.status = "available";
      await parking.save();
      connection.end_time = new Date();
      let amountStr: string = (
        calculateMinutesDifference(
          connection.start_time.getTime(),
          new Date().getTime()
        ) * parseFloat(process.env.ILS_P_M || "1.0")
      ).toFixed(2);
      const amount: number = Number(amountStr);
      connection.cost = amount;
      charge(wallet, amount)
        .then((data) => {
          connection.status = "inactive";
          connection.save();
          return res.status(201).json({
            statusCode: 200,
            message: "Money Transfered",
            data: "Car charged successfully :) ",
          });
        })
        .catch((err) => {
          logger.error(`Error in charging the user : ${err}`);
          return {
            statusCode: 500,
            message: "Internal Server Error",
            data: `Failed To charge the car for parking `,
          };
        });
    } catch (error) {
      await connection.save();
      logger.error(`Error In End Parking Session : ${error}`);
      return res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        data: `Failed To End The Connection ${error}`,
      });
    }
  }
};

const getHistory = async (
  req: express.Request,
  res: express.Response,
  payload: GetAll,
  id: string
) => {
  try {
    const page = parseInt(payload.page);
    const pageSize = parseInt(payload.pageSize);
    const [connections, total] = await Connection.findAndCount({
      skip: pageSize * (page - 1),
      take: pageSize,
      order: {
        start_time: "DESC",
      },
      relations: { car: true },
      where: {
        car: {
          id: id,
        },
      },
    });
    if (!connections || connections.length === 0) {
      throw "car doesn't have hestory";
    } else {
      let hestory: hestory[] = [];
      connections.forEach((connection) => {
        let temp: hestory = {
          cost: 0,
          duration: "",
          location: "",
          park_At: new Date().toTimeString(),
          leave_At: new Date().toTimeString(),
          parking_id: 0,
        };
        temp.parking_id = connection.parking.customid;
        temp.cost = connection.cost;
        temp.park_At = connection.start_time.toTimeString();
        temp.leave_At = connection.end_time.toTimeString();
        temp.location = connection.parking.location;
        temp.duration = `${calculateMinutesDifference(
          connection.start_time.getTime(),
          connection.end_time.getTime()
        ).toFixed(2)} Minutes`;
        hestory.push(temp);
      });
      return {
        page,
        pageSize: connections.length,
        total,
        hestory: hestory,
      };
    }
  } catch (err) {
    throw `new error fired: ${err}`;
  }
};
export { startConnection, endConnection, getHistory };
