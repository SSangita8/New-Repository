import { getEvents } from "./eventStore.js";

const initialState = {
  containerId: null,
  status: null,
  location: null,
  temperature: null,
  shipName: null
};

const applyEvent = (state, event) => {
  switch (event.eventType) {
    case "CONTAINER_CREATED":
      return {
        ...state,
        containerId: event.aggregateId,
        status: "CREATED",
        location: event.payload.origin
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

export const reconstructState = async (aggregateId) => {
  const events = await getEvents(aggregateId);

  const state = events.reduce(
    (currentState, event) => applyEvent(currentState, event),
    initialState
  );

  return {
    state,
    events
  };
};
