import express from "express";
import {
  validateManagerLogin,
  validateNewCar,
  validateManager,
  validateUserLogin,
} from "../middleware/validation/car";
import {
  insertCar,
  insertManager,
  managerLogin,
  setManagerPassword,
  setPassword,
  userLogin,
} from "../controllers/car";
import { authenticate } from "../middleware/auth/authentication";
import { authorize } from "../middleware/auth/authorization";
import { Car } from "../DB/Entities/Car";

const router = express.Router();

router.post(
  "/signup",
  authenticate,
  authorize("POST_car"),
  validateNewCar,
  (req, res) => {
    try {
      insertCar(req, res);
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        message: "Internal server error",
        data: { error },
      });
    }
  }
);

router.post("/user/signin", validateUserLogin, (req, res) => {
  const { Car_ID, Password } = req.body;
  userLogin(Car_ID, Password)
    .then((data) => {
      res.status(200).json({ statusCode: 200, message: "Ok", data: data });
    })
    .catch((err) => {
      res.status(400).json({ statusCode: 400, message: err, data: {} });
    });
});

router.post(
  "/manager/signup",
  authenticate,
  authorize("Admin"),
  validateManager,
  async (req, res) => {
    insertManager(req, res);
  }
);

router.post("/manager/signin", validateManagerLogin, (req, res) => {
  const { Email, Password } = req.body;
  managerLogin(Email, Password)
    .then((data) => {
      res.status(200).json({ statusCode: 200, message: "Ok", data: data });
    })
    .catch((err) => {
      res.status(400).json({
        statusCode: 400,
        message: "Invalid manager sign in credentials",
        data: {},
      });
    });
});

router.post("/set-manager-password/:email/:token", async (req, res) => {
  setManagerPassword(req, res)
    .then(() => {
      res.status(200).json({
        statusCode: 200,
        message: "Password has been set successfully",
        data: {},
      });
    })
    .catch((err) => {
      res.status(400).json({
        statusCode: 400,
        message: "Bad Request",
        data: { err },
      });
    });
});

router.post("/set-password/:id/:token", async (req, res) => {
  try {
    setPassword(req, res)
      .then(() => {
        res.status(200).json({
          statusCode: 200,
          message: "Password has been set successfully",
          data: {},
        });
      })
      .catch((err) => {
        res.status(400).json({
          statusCode: 400,
          message: "Not accepted password",
          data: { err },
        });
      });
  } catch (error) {
    res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", data: {} });
  }
});

router.post("/signout", authenticate, async (req, res) => {
  const token = req.headers["authorization"] || "";
  const del = await Car.findOneBy({ token: token });
  if (del) {
    del.token = "";
    await del.save();
  }
  return res
    .status(200)
    .json({ statusCode: 200, message: "signed out successfully", data: {} });
});

export default router;
