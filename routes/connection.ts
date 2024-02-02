import express from "express";
import { authenticate } from "../middleware/auth/authentication";
import { authorize } from "../middleware/auth/authorization";
import jwt from 'jsonwebtoken'
import {
  validateNewConnection,
} from "../middleware/validation/connection";
import { startConnection } from "../controllers/connection";
const router = express.Router();
router.post(
  "/park",
  authenticate,
  // authorize("Park"),
  validateNewConnection,
  async (req, res) => {
    startConnection(req, res);
  }
);

export default router;
