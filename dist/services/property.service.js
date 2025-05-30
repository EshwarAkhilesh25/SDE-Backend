"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProperties = exports.deleteProperty = exports.updateProperty = exports.getPropertyById = exports.createProperty = void 0;
const Property_1 = __importDefault(require("../models/Property"));
const redis_1 = require("../config/redis");
const cacheExpiration = 3600;
const createProperty = async (propertyData) => {
    const property = await Property_1.default.create(propertyData);
    return property;
};
exports.createProperty = createProperty;
const getPropertyById = async (id) => {
    const cacheKey = `property:${id}`;
    const cachedData = await redis_1.redisClient.get(cacheKey);
    if (cachedData) {
        return JSON.parse(cachedData);
    }
    const property = await Property_1.default.findById(id).populate('createdBy', 'name email');
    if (property) {
        await redis_1.redisClient.setEx(cacheKey, cacheExpiration, JSON.stringify(property));
    }
    return property;
};
exports.getPropertyById = getPropertyById;
const updateProperty = async (id, updateData, userId) => {
    const property = await Property_1.default.findOne({ _id: id, createdBy: userId });
    if (!property) {
        throw new Error('Property not found or not authorized');
    }
    Object.assign(property, updateData);
    await property.save();
    const cacheKey = `property:${id}`;
    await redis_1.redisClient.setEx(cacheKey, cacheExpiration, JSON.stringify(property));
    return property;
};
exports.updateProperty = updateProperty;
const deleteProperty = async (id, userId) => {
    const property = await Property_1.default.findOneAndDelete({ _id: id, createdBy: userId });
    if (!property) {
        throw new Error('Property not found or not authorized');
    }
    await redis_1.redisClient.del(`property:${id}`);
    return property;
};
exports.deleteProperty = deleteProperty;
const searchProperties = async (filters) => {
    const { type, minPrice, maxPrice, state, city, minArea, maxArea, bedrooms, bathrooms, furnished, amenities, tags, listingType, sortBy, limit = 10, page = 1 } = filters;
    const query = {};
    if (type)
        query.type = type;
    if (state)
        query.state = state;
    if (city)
        query.city = city;
    if (furnished)
        query.furnished = furnished;
    if (listingType)
        query.listingType = listingType;
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice)
            query.price.$gte = Number(minPrice);
        if (maxPrice)
            query.price.$lte = Number(maxPrice);
    }
    if (minArea || maxArea) {
        query.areaSqFt = {};
        if (minArea)
            query.areaSqFt.$gte = Number(minArea);
        if (maxArea)
            query.areaSqFt.$lte = Number(maxArea);
    }
    if (bedrooms)
        query.bedrooms = Number(bedrooms);
    if (bathrooms)
        query.bathrooms = Number(bathrooms);
    if (amenities) {
        query.amenities = { $all: amenities.split(',') };
    }
    if (tags) {
        query.tags = { $all: tags.split(',') };
    }
    const skip = (Number(page) - 1) * Number(limit);
    let sortOption = {};
    if (sortBy) {
        const sortFields = sortBy.split(',');
        sortOption = sortFields.reduce((acc, field) => {
            const order = field.startsWith('-') ? -1 : 1;
            const fieldName = field.replace(/^-/, '');
            acc[fieldName] = order;
            return acc;
        }, {});
    }
    const properties = await Property_1.default.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit))
        .populate('createdBy', 'name email');
    const total = await Property_1.default.countDocuments(query);
    return {
        properties,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
    };
};
exports.searchProperties = searchProperties;
