import express from "express";
import {
  validateManagerLogin,
  validateNewCar,
  validateNewCarByAdmin,
  validateNewManagerByAdmin,
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

const router = express.Router();

router.post("/signup",authenticate, validateNewCar, (req, res) => {
  try {
    insertCar(req, res);
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: "Internal server error", data: {error} });
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
      res.status(200).json({ statusCode: 200, message: "Ok", data: data });
    })
    .catch((err) => {
      res.status(400).json({ statusCode: 400, message: "Invalid manager sign in credentials", data: {} });
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
      res.status(200).json({ statusCode: 200, message: "Ok", data: data });
    })
    .catch((err) => {
      res.status(400).json({ statusCode: 400, message: err, data: {} });
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
      res.status(500).json({statusCode: 500, message: "Server error while car registration", data:{}});
    }
  } else if (req.body.Role === "Manager") {
    try {
      const x = await validateNewManagerByAdmin(req, res);

      if (x === true) {
        insertManager(req, res);
      }
    } catch (err) {
      res.status(500).json({statusCode: 500, message: "internal server error", data: {err}});
    }
  } else res.status(401).json({statusCode: 401, message: "Invalid manager credentials", data: {}});
});

router.post("/set-manager-password/:email/:token", async (req, res) => {
  setManagerPassword(req, res)
    .then(() => {
      res.status(200).json({statusCode: 200, message: "Password has been set successfully", data: {}});
    })
    .catch((err) => {
      res.status(400).json({statusCode: 400, message: "Not accepted password", data: {err}});
    });
});

router.post("/set-password/:id/:token", async (req, res) => {
  try {
    setPassword(req, res)
      .then(() => {
        res.status(200).json({statusCode: 200, message: "Password has been set successfully", data: {}});
      })
      .catch((err) => {
        res.status(400).json({statusCode: 400, message: "Not accepted password", data: {err}});
      });
  } catch (error) {
    res.status(500).json({statusCode: 500, message: "Internal server error", data: {}});
  }
});

export default router;
