const mongoose = require("mongoose");

const TireSchema = new mongoose.Schema(
  {
    tireCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    maxLifeKm: {
      type: Number,
      required: true,
    },

    currentLifeKm: {
      type: Number,
      default: 0,
    },

    originalTireCode: {
      type: String,
      default: null, // for retread tires
    },

    repairCount: {
      type: Number,
      default: 0,
    },

    lastRepairDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "available",
        "mounted",
        "damaged",   
        "punctured",
        "expired",
        "repaired",
        "scrapped",
      ],
      default: "available",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Tire", TireSchema);
