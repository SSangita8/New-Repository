import Event from "../models/Event.js";

export const appendEvent = async ({
  aggregateId,
  eventType,
  payload,
  version
}) => {
  const event = await Event.create({
    aggregateId,
    eventType,
    payload,
    version
  });

  return event;
};

export const getEvents = async (aggregateId) => {
  return Event.find({ aggregateId })
    .sort({ version: 1 })
    .lean();
};

export const getLatestVersion = async (aggregateId) => {
  const latestEvent = await Event.findOne({ aggregateId })
    .sort({ version: -1 })
    .select("version")
    .lean();

  return latestEvent?.version ?? 0;
};
