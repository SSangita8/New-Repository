import { appendEvent } from "../services/eventStore.js";

export const createContainer = async ({
  containerId,
  origin,
  destination
}) => {
  const event = await appendEvent({
    aggregateId: containerId,
    eventType: "CONTAINER_CREATED",
    payload: {
      origin,
      destination
    },
    expectedVersion: 0
  });

  return event;
};
