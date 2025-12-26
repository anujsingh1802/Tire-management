const busService = require("../services/busService");


exports.createBus = async (req, res) => {
  try {
    const bus = await busService.createBus(req.body);
    res.status(201).json(bus);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getAllBuses = async (req, res) => {
  const buses = await busService.getAllBuses();
  res.json(buses);
};

exports.getBusById = async (req, res) => {
  const bus = await busService.getBusById(req.params.id);
  res.json(bus);
};


/**
 * GET /buses/eligibility?tripDistance=XXXX
 */
exports.getBusEligibility = async (req, res) => {
  try {
    const tripDistance = Number(req.query.tripDistance);

    if (!tripDistance || tripDistance <= 0) {
      return res
        .status(400)
        .json({ message: "Valid tripDistance is required" });
    }

    const buses = await busService.getBusEligibility(tripDistance);
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
