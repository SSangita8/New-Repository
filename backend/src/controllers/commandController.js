import { createContainer } from "../commands/containerCommands.js";

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
    res.status(400).json({
      message: error.message
    });
  }
};
