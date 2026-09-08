import Event from "../models/Event.js";

export const appendEvent = async ({
  aggregateId,
  eventType,
  payload,
  expectedVersion
}) => {
  const latestEvent = await Event.findOne({ aggregateId })
    .sort({ version: -1 })
    .select("version")
    .lean();

  const currentVersion = latestEvent?.version ?? 0;

  if (currentVersion !== expectedVersion) {
    throw new Error(
      `Concurrency conflict. Expected version ${expectedVersion}, but current version is ${currentVersion}.`
    );
  }

  const event = await Event.create({
    aggregateId,
    eventType,
    payload,
    version: currentVersion + 1
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
