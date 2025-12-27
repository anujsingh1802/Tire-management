const Tire = require("../models/tireModel");

/**
 * Updates tire status WITHOUT saving
 */
function deriveTireStatus(tire) {
  if (tire.currentLifeKm >= tire.maxLifeKm) {
    return "expired";
  }
  return tire.status;
}

/**
 * CREATE
 */
exports.createTire = async ({ tireCode, maxLifeKm }) => {
  return Tire.create({ tireCode, maxLifeKm });
};

/**
 * GET ALL
 */
exports.getAllTires = async () => {
  const tires = await Tire.find();

  return tires.map((t) => {
    const status = deriveTireStatus(t);

    return {
      _id: t._id,
      tireCode: t.tireCode,
      kmUsed: t.currentLifeKm,
      maxKm: t.maxLifeKm,
      status,
      isExpired: status === "expired",
      remainingKm: Math.max(t.maxLifeKm - t.currentLifeKm, 0),
    };
  });
};

/**
 * GET BY ID
 */
exports.getTireById = async (id) => {
  const t = await Tire.findById(id);
  if (!t) throw new Error("Tire not found");

  const status = deriveTireStatus(t);

  return {
    _id: t._id,
    tireCode: t.tireCode,
    kmUsed: t.currentLifeKm,
    maxKm: t.maxLifeKm,
    status,
    isExpired: status === "expired",
    remainingKm: Math.max(t.maxLifeKm - t.currentLifeKm, 0),
  };
};

/**
 * 🔧 HYBRID REPAIR TIRE
 */
exports.repairTire = async (id, body) => {
  const { type, newTireCode, maxLifeKm } = body;

  const tire = await Tire.findById(id);
  if (!tire) throw new Error("Tire not found");

  // ❌ expired tire cannot be repaired
  if (tire.currentLifeKm >= tire.maxLifeKm) {
    throw new Error("Expired tire cannot be repaired");
  }

  // ✅ NOW WORKS (damaged is valid enum)
  if (tire.status !== "damaged") {
    throw new Error("Only damaged tires can be repaired");
  }

  /* 🔁 FLOW A: MINOR REPAIR */
  if (type === "minor") {
    tire.status = "available";
    tire.repairCount += 1;
    tire.lastRepairDate = new Date();
    await tire.save();

    return {
      message: "Minor repair completed",
      tire,
    };
  }

  /* 🔁 FLOW B: RETREAD */
  if (type === "retread") {
    if (!newTireCode || !maxLifeKm) {
      throw new Error("Retread requires new tire code and life");
    }

    tire.status = "repaired";
    tire.repairCount += 1;
    tire.lastRepairDate = new Date();
    await tire.save();

    const newTire = await Tire.create({
      tireCode: newTireCode,
      originalTireCode: tire.tireCode,
      maxLifeKm,
      currentLifeKm: 0,
      status: "available",
    });

    return {
      message: "Retread completed",
      oldTire: tire,
      newTire,
    };
  }

  throw new Error("Invalid repair type");
};

/**
 * CHECK IF TIRE CAN RUN REQUIRED KM
 */
exports.canTireRunDistance = async (tireId, requiredKm) => {
  const tire = await Tire.findById(tireId);
  if (!tire) throw new Error("Tire not found");

  if (tire.currentLifeKm >= tire.maxLifeKm) {
    throw new Error("Tire is expired");
  }

  const remainingKm = tire.maxLifeKm - tire.currentLifeKm;

  if (remainingKm < requiredKm) {
    throw new Error(
      `Tire has only ${remainingKm} km remaining, cannot run ${requiredKm} km`
    );
  }

  return true;
};
