import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    last_name: { type: String, required: false, default: "" },
    phone: { type: String, required: false, default: "" },
    email: { type: String, required: true, unique: true, match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g },
    password: { type: String, required: true }
});

export default mongoose.model("User", UserSchema);