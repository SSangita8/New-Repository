import {
  appendEvent,
  getLatestVersion
} from "../services/eventStore.js";

export const createContainer = async ({
  containerId,
  origin,
  destination
}) => {
  const currentVersion = await getLatestVersion(containerId);

  if (currentVersion !== 0) {
    throw new Error("Container already exists");
  }

  const event = await appendEvent({
    aggregateId: containerId,
    eventType: "CONTAINER_CREATED",
    payload: {
      origin,
      destination
    },
    version: 1
  });

  return event;
};
