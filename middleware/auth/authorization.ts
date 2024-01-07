import express from "express";
import { Permission } from "../../DB/Entities/Permission";
import jwt from "jsonwebtoken";
import { Car } from "../../DB/Entities/Car";
const authorize = (api: string) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const token = req.headers["authorization"] || "";  
    const decoded = jwt.decode(token, { json: true });
    const car = await Car.findOneBy({ id: decoded?.userId });
    const permissions: Permission[] = car?.role?.permissions || [];
    console.log("permissions: ", permissions);
    if (
      permissions.filter((p) => {
        return p.name === api || p.name === "Admin";
      }).length > 0
    ) {
      next();
    } else {
      res
        .status(403)
        .json({
          statusCode: 403,
          message: "you don't have the permission to access this resource!",
          data: {},
        });
    }
  };
};

export { authorize };
