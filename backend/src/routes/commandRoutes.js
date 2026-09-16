import express from "express";

import {
  createContainerController,
  loadContainerOnShipController,
  recordTemperatureSpikeController,
  markContainerArrivedController
} from "../controllers/commandController.js";

const router = express.Router();

router.post(
  "/container",
  createContainerController
);

router.post(
  "/container/load",
  loadContainerOnShipController
);

router.post(
  "/container/temperature-spike",
  recordTemperatureSpikeController
);

router.post(
  "/container/arrive",
  markContainerArrivedController
);

export default router;
