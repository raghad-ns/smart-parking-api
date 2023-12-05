import express from "express";
import jwt from "jsonwebtoken";
import { Car } from "../../DB/Entities/Car";

const authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.cookies["token"] || "";

  let tokenIsValid;
  try {
    tokenIsValid = jwt.verify(token, process.env.PASSWORD_SECRET || "");
  } catch (error) {}

  console.log(tokenIsValid);

  if (tokenIsValid) {
    const decoded = jwt.decode(token, { json: true });
    const car = await Car.findOneBy({ car_ID: decoded?.car_ID || "" });
    next();
  } else {
    res.status(401).json({statusCode: 401, message: "You need to log in", data:{}});
  }
};

export { authenticate };
