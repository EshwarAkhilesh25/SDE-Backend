"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importPropertiesFromCSV = void 0;
const csv_parser_1 = __importDefault(require("csv-parser"));
const fs_1 = __importDefault(require("fs"));
const Property_1 = __importDefault(require("../models/Property"));
const User_1 = __importDefault(require("../models/User"));
const importPropertiesFromCSV = async (filePath, adminUserId) => {
    const properties = [];
    // First, find or create an admin user to associate with imported properties
    let adminUser = await User_1.default.findById(adminUserId);
    if (!adminUser) {
        throw new Error('Admin user not found');
    }
    return new Promise((resolve, reject) => {
        fs_1.default.createReadStream(filePath)
            .pipe((0, csv_parser_1.default)())
            .on('data', (data) => {
            // Transform CSV data to match our schema
            const property = {
                title: data.title,
                type: data.type,
                price: Number(data.price),
                state: data.state,
                city: data.city,
                areaSqFt: Number(data.areaSqFt),
                bedrooms: Number(data.bedrooms),
                bathrooms: Number(data.bathrooms),
                amenities: data.amenities.split('|'),
                furnished: data.furnished,
                availableFrom: new Date(data.availableFrom),
                listedBy: data.listedBy,
                tags: data.tags.split('|'),
                colorTheme: data.colorTheme,
                rating: Number(data.rating),
                isVerified: data.isVerified === 'TRUE',
                listingType: data.listingType,
                createdBy: adminUser._id
            };
            properties.push(property);
        })
            .on('end', async () => {
            try {
                await Property_1.default.insertMany(properties);
                console.log(`Successfully imported ${properties.length} properties`);
                resolve(properties.length);
            }
            catch (error) {
                console.error('Error importing properties:', error);
                reject(error);
            }
        })
            .on('error', (error) => {
            console.error('Error reading CSV file:', error);
            reject(error);
        });
    });
};
exports.importPropertiesFromCSV = importPropertiesFromCSV;
