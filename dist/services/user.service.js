"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendations = exports.recommendProperty = exports.removeFavorite = exports.addFavorite = exports.updateUserProfile = exports.getUserProfile = exports.authUser = exports.registerUser = void 0;
const User_1 = __importDefault(require("../models/User"));
const Property_1 = __importDefault(require("../models/Property"));
const redis_1 = require("../config/redis");
const mongoose_1 = __importDefault(require("mongoose"));
const cacheExpiration = 3600; // 1 hour
// Helper function to safely create ObjectId from string
const toObjectId = (id) => {
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        throw new Error(`Invalid ObjectId: ${id}`);
    }
    return new mongoose_1.default.Types.ObjectId(id);
};
const registerUser = async (name, email, password) => {
    const userExists = await User_1.default.findOne({ email });
    if (userExists) {
        throw new Error('User already exists');
    }
    const user = await User_1.default.create({ name, email, password });
    return user;
};
exports.registerUser = registerUser;
const authUser = async (email, password) => {
    const user = await User_1.default.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        return user;
    }
    else {
        throw new Error('Invalid email or password');
    }
};
exports.authUser = authUser;
const getUserProfile = async (userId) => {
    const cacheKey = `user:${userId}`;
    // Try to get data from cache
    const cachedData = await redis_1.redisClient.get(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    // If not in cache, get from DB and cache it
    const user = await User_1.default.findById(userId).select('-password');
    if (user) {
        await redis_1.redisClient.setEx(cacheKey, cacheExpiration, JSON.stringify(user));
    }
    return user;
};
exports.getUserProfile = getUserProfile;
const updateUserProfile = async (userId, updateData) => {
    const user = await User_1.default.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    Object.assign(user, updateData);
    await user.save();
    // Update cache
    await redis_1.redisClient.del(`user:${userId}`);
    return user;
};
exports.updateUserProfile = updateUserProfile;
const addFavorite = async (userId, propertyId) => {
    const user = await User_1.default.findById(userId);
    const property = await Property_1.default.findById(propertyId);
    if (!user || !property) {
        throw new Error('User or property not found');
    }
    if (!user.favorites.includes(property._id)) {
        user.favorites.push(property._id);
        await user.save();
    }
    await redis_1.redisClient.del(`user:${userId}`);
    return user;
};
exports.addFavorite = addFavorite;
const removeFavorite = async (userId, propertyId) => {
    const user = await User_1.default.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    user.favorites = user.favorites.filter(fav => fav.toString() !== propertyId);
    await user.save();
    await redis_1.redisClient.del(`user:${userId}`);
    return user;
};
exports.removeFavorite = removeFavorite;
const recommendProperty = async (senderId, recipientEmail, propertyId) => {
    const recipient = await User_1.default.findOne({ email: recipientEmail });
    const property = await Property_1.default.findById(propertyId);
    if (!recipient || !property) {
        throw new Error('Recipient or property not found');
    }
    const existingRecommendation = recipient.recommendationsReceived.find(rec => rec.property.toString() === propertyId &&
        rec.recommendedBy.toString() === senderId);
    if (existingRecommendation) {
        throw new Error('Property already recommended to this user');
    }
    recipient.recommendationsReceived.push({
        property: property._id,
        recommendedBy: toObjectId(senderId),
        date: new Date(),
    });
    await recipient.save();
    await redis_1.redisClient.del(`user:${recipient._id}`);
    return recipient;
};
exports.recommendProperty = recommendProperty;
const getRecommendations = async (userId) => {
    const user = await User_1.default.findById(userId)
        .populate({
        path: 'recommendationsReceived',
        populate: [
            { path: 'property', model: 'Property' },
            { path: 'recommendedBy', model: 'User', select: 'name email' },
        ],
    });
    if (!user) {
        throw new Error('User not found');
    }
    return user.recommendationsReceived;
};
exports.getRecommendations = getRecommendations;
