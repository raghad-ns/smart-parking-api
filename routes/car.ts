import express from "express";
import validateNewCar from "../middleware/validation/car.js";
import { insertCar, setPassword } from "../controllers/car.js";

const router = express.Router();

router.post(
  "/signup",
  validateNewCar,
  (req, res) => {
    try {
      insertCar(req, res);
      res.status(201).send("user has been added successfully");
    } catch (error) {
      res.status(500).send(`Server Error while car registration: ${error}`);
    }
  }
);

router.post("/set-password/:id/:token", async (req, res) => {
  setPassword(req, res)
    .then(() => {
      res.status(200).send(`password has been set successfully`);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});
export default router;
