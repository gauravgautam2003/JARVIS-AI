import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    assistantName: {
        type: String,
    },
    assistantImage: {
        type: String,
    },
    history: [
        {
            type: String,
        }
    ],

}, { Timestamp: true });

const User = mongoose.model("User", userSchema);
export default User;