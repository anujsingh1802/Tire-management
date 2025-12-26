const Bus = require("../models/busModel");
const BusTireSlot = require("../models/busTireSlotModel");


exports.createBus = async (data) => {
  return await Bus.create(data);
};

exports.getAllBuses = async () => {
  return await Bus.find();
};

exports.getBusById = async (id) => {
  return await Bus.findById(id);
};


/**
 * Get bus eligibility based on trip distance
 * Rule:
 * - All slots must be filled
 * - All mounted tires must:
 *   - exist
 *   - not be expired
 *   - status === "mounted"
 *   - remainingKm >= tripDistance
 */
exports.getBusEligibility = async (tripDistance) => {
  const buses = await Bus.find({ status: "active" });

  const result = [];

  for (const bus of buses) {
    const slots = await BusTireSlot.find({ busId: bus._id }).populate("tireId");

    // Not all slots filled
    if (slots.length !== bus.totalSlots) {
      result.push({
        ...bus.toObject(),
        eligible: false,
        reason: "Not all tire slots are filled",
      });
      continue;
    }

    // Any invalid tire
    const invalidTire = slots.find((slot) => {
      const tire = slot.tireId;
      return (
        !tire ||
        tire.isExpired === true ||
        tire.status !== "mounted" ||
        tire.remainingKm < tripDistance
      );
    });

    if (invalidTire) {
      result.push({
        ...bus.toObject(),
        eligible: false,
        reason: "Insufficient tire life for trip",
      });
    } else {
      result.push({
        ...bus.toObject(),
        eligible: true,
        reason: "Eligible",
      });
    }
  }

  return result;
};
