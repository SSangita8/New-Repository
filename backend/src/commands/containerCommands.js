import { appendEvent } from "../services/eventStore.js";

export const createContainer = async ({
  containerId,
  origin,
  destination
}) => {
  return appendEvent({
    aggregateId: containerId,
    eventType: "CONTAINER_CREATED",
    payload: {
      origin,
      destination
    },
    expectedVersion: 0
  });
};

export const loadContainerOnShip = async ({
  containerId,
  shipName,
  expectedVersion
}) => {
  return appendEvent({
    aggregateId: containerId,
    eventType: "LOADED_ON_SHIP",
    payload: {
      shipName
    },
    expectedVersion
  });
};

export const recordTemperatureSpike = async ({
  containerId,
  temperature,
  expectedVersion
}) => {
  return appendEvent({
    aggregateId: containerId,
    eventType: "TEMPERATURE_SPIKE",
    payload: {
      temperature
    },
    expectedVersion
  });
};

export const markContainerArrived = async ({
  containerId,
  port,
  expectedVersion
}) => {
  return appendEvent({
    aggregateId: containerId,
    eventType: "ARRIVED_AT_PORT",
    payload: {
      port
    },
    expectedVersion
  });
};
