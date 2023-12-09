import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
      dateTime: {
        type: Date,
        required: true,
      },
      serviceName: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
        min: 0, 
      },
      
    },
    { timestamps: true }
  );

export default mongoose.model("Service", serviceSchema);