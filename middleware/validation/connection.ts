import express from "express";
import { Connection } from "../../DB/Entities/Connection";
import { Parking } from "../../DB/Entities/Parking";
import jwt from "jsonwebtoken";
import { Car } from "../../DB/Entities/Car";
import { logger, secureLog } from "../../log";

const validateNewConnection = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.body.parkingId) {
    logger.error("Trying to start connection without parking id");
    return res.status(400).json({
      statusCode: 400,
      message: "Bad Request",
      data: "Missing parking id",
    });
  } else {
    const parkingId = Number(req.body.parkingId);
    if (!Number.isInteger(parkingId)) {
      logger.error(`Invalid parking id format: ${parkingId}`);
      return res.status(400).json({
        statusCode: 400,
        message: "Bad Request",
        data: "Invalid parking id",
      });
    }
    try {
      const parking = await Parking.findOne({ where: { customid: parkingId } });

      if (!parking) {
        secureLog("info", `No parking found with the given ID: ${parkingId}`);
        return res.status(404).json({
          statusCode: 404,
          message: "Bad Request",
          data: "Parking is not found",
        });
      } else if (parking.status !== "available") {
        secureLog(
          "info",
          `The parking with the ID ${parkingId} is currently occupied`
        );
        return res.status(400).json({
          statusCode: 400,
          message: "Bad Request",
          data: "Parking is not available",
        });
      } else {
        //detect if the car is parked or not
        const token = jwt.decode(req.headers["authorization"] || "", {
          json: true,
        });
        const x = new Car();
        const car = await Connection.find({
          relations: {
            car: true,
          },
          where: {
            car: {
              id: token?.userId,
            },
            status: "active",
          },
        });

        if (car.length !== 0) {
          logger.error(
            `the car with id ${token?.userId} trying to use parking while it's already parked. ${car}`
          );
          return res.status(400).json({
            statusCode: 400,
            message: "Bad Request",
            data: "car is already parked",
          });
        } else {
          next();
        }
      }
    } catch (err) {
      logger.error(`Error in validateCarIsNotAlreadyInAParking :${err} `);
      return res.status(500).json({
        statusCode: 500,
        message: "Server Error",
        data: "error in validating new connection",
      });
    }
  }
};

const validateEndConnection = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const decode = jwt.decode(req.headers["authorization"] || "", { json: true });
  const connection = await Connection.find({
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
  //how to deal when the car has more than one active connections?
  if (connection.length > 1) {
    logger.error(
      `DB has been manipulated and car is has more than one connection: ${connection}`
    );
  }
  if (!connection) {
    secureLog(
      "info",
      `No active Connection found for car with id: ${decode?.userId}`
    );
    return res.status(404).json({
      statusCode: 404,
      message: "Not Found",
      data: "No Active Connection Found For This User.",
    });
  } else {
    next();
  }
};

export { validateNewConnection, validateEndConnection };
