import express from "express";
import { Permission } from "../../DB/Entities/Permission";

const authorize = (api: string) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const permissions: Permission[] = res.locals.car.role.permissions || [];
    if (
      permissions.filter((p) => {
        return p.name === api || p.name === "Admin";
      }).length > 0
    ) {
      next();
    } else {
      res
        .status(403)
        .send("you don't have the permission to access this resource!");
    }
  };
};

export { authorize };
