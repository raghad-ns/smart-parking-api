import express from "express";
import { Parking } from "../../DB/Entities/Parking";
import { logger } from "../../log";

const validateNewParking = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const values = ["customid", "location"];
  const car = req.body;
  let errorList = [];
  values.forEach((key) => {
    if (!car[key]) {
      errorList.push(`${key} is Required to add new car!`);
    }
  });

  const checkCar = await Parking.findOneBy({ customid: car.customid });

  if (checkCar !== null) {
    errorList.push("Invalid parking ID");
  }

  if (errorList.length) {
    logger.error(`Parking Validation Errors : ${JSON.stringify(errorList)}`);
    return res.status(401).json({
      statusCode: 401,
      message: "Invalid parking credentials",
      data: errorList,
    });
  } else {
    next();
  }
};

export default validateNewParking;
