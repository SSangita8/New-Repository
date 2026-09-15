import {
  createContainer,
  loadContainerOnShip,
  recordTemperatureSpike,
  markContainerArrived
} from "../commands/containerCommands.js";

export const createContainerController = async (req, res) => {
  try {
    const { containerId, origin, destination } = req.body;

    if (!containerId || !origin || !destination) {
      return res.status(400).json({
        message: "containerId, origin and destination are required"
      });
    }

    const event = await createContainer({
      containerId,
      origin,
      destination
    });

    res.status(201).json({
      message: "Container created successfully",
      event
    });
  } catch (error) {
    res.status(409).json({
      message: error.message
    });
  }
};

export const loadContainerOnShipController = async (req, res) => {
  try {
    const { containerId, shipName, expectedVersion } = req.body;

    if (
      !containerId ||
      !shipName ||
      expectedVersion === undefined
    ) {
      return res.status(400).json({
        message:
          "containerId, shipName and expectedVersion are required"
      });
    }

    const event = await loadContainerOnShip({
      containerId,
      shipName,
      expectedVersion
    });

    res.status(201).json({
      message: "Container loaded on ship",
      event
    });
  } catch (error) {
    res.status(409).json({
      message: error.message
    });
  }
};

export const recordTemperatureSpikeController = async (
  req,
  res
) => {
  try {
    const {
      containerId,
      temperature,
      expectedVersion
    } = req.body;

    if (
      !containerId ||
      temperature === undefined ||
      expectedVersion === undefined
    ) {
      return res.status(400).json({
        message:
          "containerId, temperature and expectedVersion are required"
      });
    }

    const event = await recordTemperatureSpike({
      containerId,
      temperature,
      expectedVersion
    });

    res.status(201).json({
      message: "Temperature spike recorded",
      event
    });
  } catch (error) {
    res.status(409).json({
      message: error.message
    });
  }
};

export const markContainerArrivedController = async (
  req,
  res
) => {
  try {
    const { containerId, port, expectedVersion } = req.body;

    if (
      !containerId ||
      !port ||
      expectedVersion === undefined
    ) {
      return res.status(400).json({
        message:
          "containerId, port and expectedVersion are required"
      });
    }

    const event = await markContainerArrived({
      containerId,
      port,
      expectedVersion
    });

    res.status(201).json({
      message: "Container arrival recorded",
      event
    });
  } catch (error) {
    res.status(409).json({
      message: error.message
    });
  }
};
