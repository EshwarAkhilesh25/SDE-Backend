"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const propertySchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    areaSqFt: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    amenities: { type: [String], required: true },
    furnished: { type: String, required: true },
    availableFrom: { type: Date, required: true },
    listedBy: { type: String, required: true },
    tags: { type: [String], required: true },
    colorTheme: { type: String, required: true },
    rating: { type: Number, required: true },
    isVerified: { type: Boolean, required: true },
    listingType: { type: String, required: true },
    createdBy: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
const Property = mongoose_1.default.model('Property', propertySchema);
exports.default = Property;
