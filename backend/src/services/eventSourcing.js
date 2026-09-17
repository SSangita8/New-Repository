import { getEvents } from "./eventStore.js";

const initialState = {
  containerId: null,
  status: null,
  location: null,
  temperature: null,
  shipName: null,
  destination: null
};

const applyEvent = (state, event) => {
  switch (event.eventType) {
    case "CONTAINER_CREATED":
      return {
        ...state,
        containerId: event.aggregateId,
        status: "CREATED",
        location: event.payload.origin,
        destination: event.payload.destination
      };

    case "LOADED_ON_SHIP":
      return {
        ...state,
        status: "IN_TRANSIT",
        shipName: event.payload.shipName
      };

    case "TEMPERATURE_SPIKE":
      return {
        ...state,
        temperature: event.payload.temperature
      };

    case "ARRIVED_AT_PORT":
      return {
        ...state,
        status: "ARRIVED",
        location: event.payload.port
      };

    default:
      return state;
  }
};

const replayEvents = (events) => {
  return events.reduce(
    (state, event) => applyEvent(state, event),
    initialState
  );
};

export const reconstructState = async (aggregateId) => {
  const events = await getEvents(aggregateId);

  return {
    state: replayEvents(events),
    events
  };
};

export const reconstructStateAt = async (
  aggregateId,
  timestamp
) => {
  const events = await getEvents(aggregateId);

  const historicalEvents = events.filter(
    (event) => new Date(event.timestamp) <= new Date(timestamp)
  );

  return {
    state: replayEvents(historicalEvents),
    events: historicalEvents
  };
};
