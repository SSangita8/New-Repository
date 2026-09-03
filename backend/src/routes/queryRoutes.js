import express from "express";
import {
  getContainer
} from "../controllers/queryController.js";

const router = express.Router();

router.get("/container/:id", getContainer);

export default router;
