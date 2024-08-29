const PriceHistorySchema = require("../../models/CropPriceModels/PriceHistory");

exports.addHistory = async (req, res) => {
  try {
    const { Crop_name, Price, Market } = req.body;

    if (!Crop_name || !Price || !Market) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (typeof Price !== "number" || Price <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }
    const dateInSriLanka = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());

    // Create a new Crop entry
    const newCrop = new PriceHistorySchema({
      Crop_name: Crop_name,
      Price: Price,
      Market: Market,
      date: dateInSriLanka,
    });

    await newCrop.save();
    console.log(newCrop);
    res.json({ message: "Crop added", Crop: newCrop });
  } catch (err) {
    console.error("Error occurred while adding Crop:", err);
    res.status(500).json({ error: "An error occurred while adding Crop" });
  }
};

exports.history = async (req, res) => {
  try {
    const Prices = await PriceHistorySchema.find().sort({ createdAt: -1 });
    res.json(Prices);
  } catch (err) {
    console.log(err);
  }
};
