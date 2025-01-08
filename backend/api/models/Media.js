import mongoose from "mongoose";
import model from "../../config/model.js";

const mediaSchema = new mongoose.Schema({
  url: { type: String},
  fileName: { type: String},
  filePath: { type: String},
  size: { type: Number},
  status: { type: String},
  mediaType: { type: String},
  contentType: { type: String},
  originalName: { type: String},
  key: { type: String},
  convertedSize: { type: Number},
  isConverted: { type: Boolean},
  ...model
});

const Media = mongoose.model("Media", mediaSchema);

export default Media;
