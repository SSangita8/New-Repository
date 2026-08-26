import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    aggregateId: {
      type: String,
      required: true,
      index: true
    },

    eventType: {
      type: String,
      required: true
    },

    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },

    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true
    },

    version: {
      type: Number,
      required: true
    }
  },
  {
    versionKey: false
  }
);

eventSchema.index(
  { aggregateId: 1, version: 1 },
  { unique: true }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
