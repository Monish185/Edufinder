const Institute = require("../models/institute");

const createInstitute = async (req, res) => {
  try {
    const { name, description, category, address, city, state, fees, rating, latitude, longitude } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ message: "Valid latitude and longitude are required" });
    }

    const institute = await Institute.create({
      name,
      description,
      category,
      address,
      city,
      state,
      fees: fees ? parseFloat(fees) : undefined,
      rating: rating ? parseFloat(rating) : undefined,
      location: { type: "Point", coordinates: [lng, lat] },
      image: req.file.path,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Institute created successfully", institute });
  } catch (error) {
    console.error("createInstitute error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Haversine formula for distance calculation
const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const getInstitutes = async (req, res) => {
  try {
    const { search, category, userLat, userLng, minFees, maxFees, minRating } = req.query;

    let query = {};

    // Text search across multiple fields
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
        { state: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    // Fee range filter
    if (minFees || maxFees) {
      query.fees = {};
      if (minFees) query.fees.$gte = parseFloat(minFees);
      if (maxFees) query.fees.$lte = parseFloat(maxFees);
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    let institutes;

    if (userLat && userLng) {
      const lat = parseFloat(userLat);
      const lng = parseFloat(userLng);

      institutes = await Institute.find({
        ...query,
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
            $maxDistance: 50000, // 50 km radius
          },
        },
      }).populate("createdBy", "name email");

      // Attach distance to each result
      institutes = institutes.map((inst) => {
        const obj = inst.toObject();
        if (inst.location?.coordinates?.length === 2) {
          const dist = haversineDistance(lat, lng, inst.location.coordinates[1], inst.location.coordinates[0]);
          obj.distanceInKm = Math.round(dist * 10) / 10;
        }
        return obj;
      });
    } else {
      institutes = await Institute.find(query).populate("createdBy", "name email").sort({ createdAt: -1 });
    }

    res.status(200).json({ count: institutes.length, institutes });
  } catch (error) {
    console.error("getInstitutes error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getInstituteById = async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id).populate("createdBy", "name email");
    if (!institute) return res.status(404).json({ message: "Institute not found" });
    res.status(200).json(institute);
  } catch (error) {
    console.error("getInstituteById error:", error);
    res.status(500).json({ message: error.message });
  }
};

const deleteInstitute = async (req, res) => {
  try {
    const institute = await Institute.findById(req.params.id);
    if (!institute) return res.status(404).json({ message: "Institute not found" });

    // Only admin or creator can delete
    if (
      !req.user.isAdmin &&
      String(institute.createdBy) !== String(req.user._id)
    ) {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }

    await Institute.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Institute deleted successfully" });
  } catch (error) {
    console.error("deleteInstitute error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createInstitute, getInstitutes, getInstituteById, deleteInstitute };
