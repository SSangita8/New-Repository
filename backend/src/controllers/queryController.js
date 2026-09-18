import {
  reconstructState,
  reconstructStateAt
} from "../services/eventSourcing.js";

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

export const getContainerHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await reconstructState(id);

    if (result.events.length === 0) {
      return res.status(404).json({
        message: "Container not found"
      });
    }

    res.json({
      containerId: id,
      events: result.events
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

export const getHistoricalState = async (req, res) => {
  try {
    const { id } = req.params;
    const { at } = req.query;

    if (!at) {
      return res.status(400).json({
        message: "The 'at' timestamp is required"
      });
    }

    const timestamp = new Date(at);

    if (Number.isNaN(timestamp.getTime())) {
      return res.status(400).json({
        message: "Invalid timestamp"
      });
    }

    const result = await reconstructStateAt(
      id,
      timestamp
    );

    if (result.events.length === 0) {
      return res.status(404).json({
        message: "No state exists at this timestamp"
      });
    }

    res.json({
      containerId: id,
      timestamp,
      state: result.state,
      events: result.events
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
