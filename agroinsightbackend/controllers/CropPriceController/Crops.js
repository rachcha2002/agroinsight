const CropSchema = require("../../models/CropPriceModels/Crop");
const { DeleteImage } = require('./firebase-Controller');


exports.addCrop = async (req, res) => {
  try {
    const { Crop_name, Price, Market, image } = req.body;

    if (!Crop_name || !Price || !Market || !image) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (typeof Price !== "number" || Price <= 0) {
      return res.status(400).json({ error: "Price must be a positive number" });
    }

    const newCrop = new CropSchema({
      Crop_name: Crop_name,
      Price: Price,
      Market: Market,
      image: image,
    });

    await newCrop.save();
    console.log(newCrop);
    res.json({ message: "Crop added", Crop: newCrop });
  } catch (err) {
    console.error("Error occurred while adding Crop:", err);
    res.status(500).json({ error: "An error occurred while adding Crop" });
  }
};

exports.updatePrice = async (req, res) => {
  try {
    const CropId = req.params.id;
    const { Price } = req.body;

    const updatedCrop = await CropSchema.findByIdAndUpdate(
      CropId,
      {Price:Price},
      { new: true }
    );

    if (!updatedCrop) {
      return res.status(404).json({ error: "Crop not found" });
    }

    res.status(200).json({ status: "Crop updated", Crop: updatedCrop });
  } catch (err) {
    console.error("Error occurred while updating Crop:", err);
    res.status(500).json({ error: "An error occurred while updating Crop" });
  }
};

exports.Croplist= async (req, res) => {
  try {
    const Crops = await CropSchema.find().sort({ createdAt: -1 });
    res.json(Crops);
  } catch (err) {
    console.log(err);
  }
};

exports.deleteCrop = async (req, res) => {
  const { id } = req.params;
  try {
    const Crop = await CropSchema.findById(id);
    if (!Crop) {
      return res.status(404).send({ status: "Crop not found" });
    }
    const Url = Crop.image;
    await DeleteImage({ body: { Url: Url } });

    await CropSchema.findByIdAndDelete(id);
    return res.status(200).send({ status: "Crop deleted successfully" });
  } catch (err) {
    console.log(err);
    if (!res.headersSent) {
      return res.status(500).send({ status: "Internal server error" });
    }
  }
};

