import express from "express";
import {
  validateManagerLogin,
  validateNewCar,
  validateNewCarByAdmin,
  validateNewManagerByAdmin,
  validateUserLogin,
} from "../middleware/validation/car.js";
import {
  insertCar,
  insertManager,
  managerLogin,
  setManagerPassword,
  setPassword,
  userLogin,
} from "../controllers/car.js";
import { authenticate } from "../middleware/auth/authentication.js";
import { authorize } from "../middleware/auth/authorization.js";

const router = express.Router();

router.post("/signup",authenticate, authorize("POST_Car"), validateNewCar, (req, res) => {
  try {
    insertCar(req, res);
  } catch (error) {
    res.status(500).send(`Server Error while car registration: ${error}`);
  }
});

router.post("/manager/signin", validateManagerLogin, (req, res) => {
  const { Email, Password } = req.body;
  managerLogin(Email, Password)
    .then((data) => {
      res.cookie("loginTime", Date.now(), {
        maxAge: 60 * 60 * 1000,
      });
      res.cookie("token", data.token, {
        maxAge: 30 * 60 * 1000,
      });

      res.status(200).send("ok");
    })
    .catch((err) => {
      res.status(400).send("pleas try again with valid credintials");
    });
});

router.post("/user/signin", validateUserLogin, (req, res) => {
  const { Car_ID, Password } = req.body;
  userLogin(Car_ID, Password)
    .then((data) => {
      res.cookie("loginTime", Date.now(), {
        maxAge: 60 * 60 * 1000,
      });
      res.cookie("token", data.token, {
        maxAge: 30 * 60 * 1000,
      });

      res.status(200).send("ok");
    })
    .catch((err) => {
      res.status(400).send("pleas try again with valid credintials");
    });
});

router.post("/POST_car",authenticate, authorize("Admin"), async (req, res) => {
  if (!req.body.Role || req.body.Role === "User") {
    try {
      const x = await validateNewCarByAdmin(req, res);
      if (x === true) {
        insertCar(req, res);
      }
    } catch (error) {
      res.status(500).send(`Server Error while car registration: ${error}`);
    }
  } else if (req.body.Role === "Manager") {
    try {
      const x = await validateNewManagerByAdmin(req, res);

      if (x === true) {
        insertManager(req, res);
      }
    } catch (err) {
      res.status(500).send(`internal server error: ${err}`);
    }
  } else res.status(401).send("Bad Request");
});

router.post("/set-manager-password/:email/:token", async (req, res) => {
  setManagerPassword(req, res)
    .then(() => {
      res.status(200).send(`Password has been set successfully`);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.post("/set-password/:id/:token", async (req, res) => {
  try {
    setPassword(req, res)
      .then(() => {
        res.status(200).send(`password has been set successfully`);
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
});

export default router;
