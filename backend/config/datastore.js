import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
		console.log("Database connected successfully");
  } catch (error) {
		console.log(error.message);
		return error.message;
	}
};

export default connectDatabase;
