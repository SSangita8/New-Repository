import { reconstructState } from "../services/eventSourcing.js";

export const getContainer = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await reconstructState(id);

    if (result.events.length === 0) {
      return res.status(404).json({
        message: "Container not found"
      });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
