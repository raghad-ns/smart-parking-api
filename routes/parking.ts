import express from "express";
import { authenticate } from "../middleware/auth/authentication";
import { authorize } from "../middleware/auth/authorization";
import validateNewParking from "../middleware/validation/parking";
import { insertParking, getAllParkings } from "../controllers/parking";
import { logger, secureLog } from "../log";

const router = express.Router();

router.post(
  "",
  authenticate,
  authorize("POST_Parking"),
  validateNewParking,
  (req, res) => {
    insertParking(req.body)
      .then((data) => {
        secureLog("info", `parking  created: ${data}`);
        res.status(201).json({
          statusCode: 201,
          message: "parking added successfully",
          data: { data },
        });
      })
      .catch((err) => {
        logger.info(`error ading new parking: ${err}`);
        res.status(500).json({
          statusCode: 500,
          message: "Internal server error",
          data: { err },
        });
      });
  }
);

router.get("/", authenticate, authorize("GET_Parking"), (req, res) => {
  const payload = {
    page: req.query.page?.toString() || "1",
    pageSize: req.query.pageSize?.toString() || "10",
  };
  getAllParkings(payload)
    .then((data) => {
      secureLog("info", `parkings  retrived: ${data}`);
      res.status(200).json({
        statusCode: 200,
        message: "parkings retrived",
        data: { data },
      });
    })
    .catch((err) => {
      logger.error(`Internal Server Error while getting parkings: ${err}`);
      res.status(500).json({
        statusCode: 500,
        message: "Internal server error",
        data: { err },
      });
    });
});

router.put("/", (req, res) => {});

export default router;
