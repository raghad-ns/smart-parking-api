import express from "express";
import jwt from "jsonwebtoken";
import { Car } from "../../DB/Entities/Car";

const authenticate = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    //read the token from the request headers
    const token = req.headers["authorization"] || "";
    if (token !== "") {
      //check if the token expired or not
      const decoded = jwt.decode(token, { json: true });
      if ((decoded as any)?.exp <= Date.now() / 1000) {
        return res.status(401).json({
          statusCode: 401,
          message: "Token has expires! login again",
          data: {},
        });
      } else {
        //verify if the token has not been manipulated
        const verify = jwt.verify(token, process.env.PASSWORD_SECRET || "");
        if (verify) {
          //check if ther's a car with this token in the database
          const car = await Car.findOneBy({ token: token });
          if (!car) {
            return res
              .status(401)
              .json({ statusCode: 401, message: "Invalid Token!", data: {} });
          } else {
            //check if the token belong  to this user
            if (decoded?.userId === car.id) next();
            else {
              return res.status(401).json({
                statusCode: 401,
                message: "invalid token!",
                data: {},
              });
            }
          }
        } else {
          return res.status(401).json({
            statusCode: 401,
            message: "invalid token!",
            data: {},
          });
        }
      }
    } else {
      return res
        .status(401)
        .json({ statusCode: 401, message: "You need to log in", data: {} });
    }
    //handle any unexpected errors while trying to authenticate
  } catch (err) {
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      data: { err },
    });
  }
};

export { authenticate };
