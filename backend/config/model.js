const model = {
  isDeleted: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Number, default: Date.now() },
  createdBy: { type: String },
  updatedAt: { type: Number },
  updatedBy: { type: String },
  deletedAt: { type: Number },
  deletedBy: { type: String },
};

export default model;