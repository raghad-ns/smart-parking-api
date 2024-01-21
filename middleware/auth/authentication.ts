import express from "express";
import jwt from "jsonwebtoken";
import { Car } from "../../DB/Entities/Car";

const authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const token = req.headers["authorization"] || "";
  const car = await Car.findOneBy({ token: token });
  if (car !== null) {
    const tokenExist = car.token;
    if (tokenExist !== "") {
      let tokenIsValid;
      try {
        tokenIsValid = jwt.verify(token, process.env.PASSWORD_SECRET || "");
      } catch (error) {}

      if (tokenIsValid) {
        const decoded = jwt.decode(token, { json: true });

        if (car.id === decoded?.userId) next();
        else res.status(400).json({statusCode: 400, message: "internal server error", data: "valid token assigned to another user"});
      }
    } else {
      res
        .status(401)
        .json({ statusCode: 401, message: "You need to log in", data: {} });
    }
  } else {
    res
      .status(401)
      .json({ statusCode: 401, message: "You need to login", data: {} });
  }
};

export { authenticate };
