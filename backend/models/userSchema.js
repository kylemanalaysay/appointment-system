import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        confirmPassword: {
            type: String,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        appointments: [{ type: mongoose.Types.ObjectId, ref: "Booking" }],
    },
    {
    timestamps: true
    }
);

export default mongoose.model("User", userSchema);
