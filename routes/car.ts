import express from "express";
import validateNewCar from "../middleware/validation/car";
import { insertCar, setPassword } from "../controllers/car";

const router = express.Router();

router.post("/signup", validateNewCar, async (req, res) => {
  try {
    insertCar(req, res);

    res.status(201).send("user has been added successfully");
  } catch (error) {
    res.status(500).send("Server Error while car registration");
  }
});

// router.get("/set-password/:id/:token", async (req, res) => {
//   const { id, token } = req.params;
//   const car = await Car.findOneBy({ id: id });
//   if (car === null) {
//     res.send("invalid id...");
//     return;
//   }
//   const secret = process.env.PASSWORD_SECRET + car.id;
//   try {
//     const payload = jwt.verify(token, secret);
//     if (payload) {
//       res.status(200).send("The password set form");
//       //render the password set view
//     } else {
//       res.status(401).send("invalid credintials");
//     }
//   } catch (error) {
//     res.send(error);
//   }
// });

//need testing
router.post("/set-password/:id/:token", async (req, res) => {
  setPassword(req, res)
    .then(() => {
      res.status(200).send(`password has been set successfully`);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});
export default router;
