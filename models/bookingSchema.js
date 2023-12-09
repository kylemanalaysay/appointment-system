import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', 
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    services: [
      {
        serviceName: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0, 
        },
      }
    ],
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Cancelled'], 
      default: 'Pending',
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
