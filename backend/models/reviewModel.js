const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        serviceId: {
            type: mongoose.Types.ObjectId,
            ref: "Service",
        },
        first_name: {
            type: String,
            required: true,
        },
        last_name: {
            type: String,
            required: true,
        },
        reviewText: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 0,
            max: 5,
            default: 0,
        }
    },
    {
    timestamps: true
    }
);

export default mongoose.model("Review", reviewSchema);