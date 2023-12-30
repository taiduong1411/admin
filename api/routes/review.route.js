import express from "express";
import { verifyToken } from "../middleware/jwt.js";
import {
  createReview,
  getReviews,
  deleteReview,
} from "../controllers/review.controller.js";
import { userRole } from "../middleware/userAuth.js"
const router = express.Router();

router.post("/", userRole, createReview);
router.get("/:gigId", getReviews);
router.delete("/:id", deleteReview);

export default router;
