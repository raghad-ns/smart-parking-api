import express from "express";
import { getReflectUsers, insertReflectUser } from "../controllers/reflect";
import { authenticate } from "../middleware/auth/authentication";
import { authorize } from "../middleware/auth/authorization";
import { validateReflect } from "../middleware/validation/reflect";
const router = express.Router();

router.get("/", authenticate, authorize("GET_All_Reflect"), (req, res) => {
  const payload = {
    page: req.query.page?.toString() || "1",
    pageSize: req.query.pageSize?.toString() || "10",
  };
  getReflectUsers(payload)
    .then((data) => {
      res.status(200).json({
        statusCode: 200,
        message: "parkings retrived",
        data: { data },
      });
    })
    .catch((err) => {
      res.status(500).json({
        statusCode: 500,
        message: "Internal server error",
        data: { err },
      });
    });
});

router.post("/", authenticate, authorize("POST_Reflect"), validateReflect, (req, res) => {
  insertReflectUser(req.body)
    .then((data) =>
      res.status(201).json({
        statusCode: 201,
        message: "new Reflect user added",
        data: { data },
      })
    )
    .catch((err) =>
      res
        .status(500)
        .json({
          statusCode: 500,
          message: "Internal server error",
          data: { err },
        })
    );
});

export default router;
