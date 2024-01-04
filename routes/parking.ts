import express from "express";
import { authenticate } from "../middleware/auth/authentication";
import { authorize } from "../middleware/auth/authorization";
import validateNewParking from "../middleware/validation/parking";
import { insertParking, getAllParkings } from "../controllers/parking";

const router = express.Router();

router.post("",authenticate, authorize("POST_parking"), validateNewParking, (req, res) => {
  insertParking(req.body)
    .then((data) => {
      res
        .status(201)
        .json({
          statusCode: 201,
          message: "parking added successfully",
          data: { data },
        });
    })
    .catch((err) => {
      res
        .status(500)
        .json({
          statusCode: 500,
          message: "Internal server error",
          data: { err },
        });
    });
});

router.get("/", authenticate, authorize("GET_parkings"), (req, res) => {
  const payload = {
    page: req.query.page?.toString() || "1",
    pageSize: req.query.pageSize?.toString() || "10",
  };
});

router.put("/", (req, res) => {});

export default router;
