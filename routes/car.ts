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
  user,
  userLogin,
} from "../controllers/car";
import { authenticate } from "../middleware/auth/authentication";
import { authorize } from "../middleware/auth/authorization";
import { Car } from "../DB/Entities/Car";
import { logger, secureLog } from "../log";

const router = express.Router();

router.post(
  "/signup",
  authenticate,
  authorize("POST_Car"),
  validateNewCar,
  (req, res) => {
    try {
      insertCar(req, res);
    } catch (error) {
      logger.error(`Error in POST /car/signup: ${error}`);
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
      secureLog("info", `new user login: ${data}`);
      res
        .status(200)
        .json({ statusCode: 200, message: "Ok", data: user(data.car) });
    })
    .catch((err) => {
      logger.error(`Error while user sign in: ${err}`);
      res.status(500).json({ statusCode: 500, message: err, data: {} });
    });
});

router.post(
  "/manager/signup",
  authenticate,
  authorize("POST_Manager"),
  validateManager,
  async (req, res) => {
    insertManager(req, res);
  }
);

router.post("/manager/signin", validateManagerLogin, (req, res) => {
  const { Email, Password } = req.body;
  managerLogin(Email, Password)
    .then((data) => {
      secureLog(
        "info",
        `The manager with email: ${Email} has set his password successfully: ${data}`
      );
      res.status(200).json({ statusCode: 200, message: "Ok", data: data });
    })
    .catch((err) => {
      logger.error(`Erron while manager login: ${err}`);
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
      secureLog(
        "info",
        `Successfully set the password for the manager with this email: ${req.params.email}`
      );
      res.status(200).json({
        statusCode: 200,
        message: "Password has been set successfully",
        data: {},
      });
    })
    .catch((err) => {
      logger.error(
        `Error setting the password for user with token: ${req.params.token}, error: ${err}`
      );
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
        secureLog(
          "info",
          `the user with id: ${req.params.id} set his password successfully`
        );
        res.status(200).json({
          statusCode: 200,
          message: "Password has been set successfully",
          data: {},
        });
      })
      .catch((err) => {
        secureLog(
          "info",
          `Not accepted password for the user  with id: ${req.params.id}. Error: ${err}`
        );
        res.status(400).json({
          statusCode: 400,
          message: "Not accepted password",
          data: { err },
        });
      });
  } catch (error) {
    logger.error(`Error while setting user password: ${error}`);
    res
      .status(500)
      .json({ statusCode: 500, message: "Internal server error", data: {} });
  }
});

router.post("/signout", authenticate, async (req, res) => {
  try {
    const token = req.headers["authorization"] || "";
    const del = await Car.findOneBy({ token: token });
    if (del) {
      del.token = "";
      await del.save();
    }
    secureLog("info", `user ${del} signed out from all devices`);
    return res
      .status(200)
      .json({ statusCode: 200, message: "signed out successfully", data: {} });
  } catch (err) {
    logger.error(`Failed to sign out user: ${err}`);
    return res.status(500).json({
      statusCode: 500,
      message: "Server error while signout",
      data: err,
    });
  }
});

export default router;
