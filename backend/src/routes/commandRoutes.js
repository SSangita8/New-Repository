import express from "express";
import {
  createContainerController
} from "../controllers/commandController.js";

const router = express.Router();

router.post(
  "/container",
  createContainerController
);

export default router;
