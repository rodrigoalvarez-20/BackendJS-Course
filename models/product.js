import mongoose from "mongoose";

const ProductSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sku: { type: String, required: true, unique: true },
    imagen: { type: String, required: false, default: "" },
    name: { type: String, required: true },
    description: { type: String, required: false, default: "" },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, required: true }
});

export default mongoose.model("Product", ProductSchema);