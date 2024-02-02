import express from "express";
import { Connection } from "../../DB/Entities/Connection";
import { Parking } from "../../DB/Entities/Parking";
import jwt from "jsonwebtoken";
import { Car } from "../../DB/Entities/Car";

const validateNewConnection = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.body.parkingId) {
    return res.status(400).json({
      statusCode: 400,
      message: "Bad Request",
      data: "Missing parking id",
    });
  } else {
    const parkingId = Number(req.body.parkingId);
    if (!Number.isInteger(parkingId))
      return res.status(400).json({
        statusCode: 400,
        message: "Bad Request",
        data: "Invalid parking id",
      });
    try {
      const parking = await Parking.findOne({ where: { customid: parkingId } });

      if (!parking)
        return res.status(404).json({
          statusCode: 404,
          message: "Bad Request",
          data: "Parking is not found",
        });
      else if (parking.status !== "available")
        return res.status(400).json({
          statusCode: 400,
          message: "Bad Request",
          data: "Parking is not available",
        });
      else {
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
        console.log(token?.userId);////////////////////////////////
        
        if (car.length !== 0) {
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
      console.log(err);
      return res.status(500).json({
        statusCode: 500,
        message: "Server Error",
        data: "error in validating new connection",
      });
    }
  }
};



export { validateNewConnection };
