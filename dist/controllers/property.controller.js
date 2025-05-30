"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchPropertiesHandler = exports.deletePropertyHandler = exports.updatePropertyHandler = exports.getPropertyHandler = exports.createPropertyHandler = void 0;
const property_service_1 = require("../services/property.service");
const createPropertyHandler = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const property = await (0, property_service_1.createProperty)({
            ...req.body,
            createdBy: req.user._id
        });
        res.status(201).json(property);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
};
exports.createPropertyHandler = createPropertyHandler;
const getPropertyHandler = async (req, res) => {
    try {
        const property = await (0, property_service_1.getPropertyById)(req.params.id);
        if (!property) {
            res.status(404).json({ message: 'Property not found' });
            return;
        }
        res.json(property);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
};
exports.getPropertyHandler = getPropertyHandler;
const updatePropertyHandler = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const property = await (0, property_service_1.updateProperty)(req.params.id, req.body, req.user._id.toString());
        res.json(property);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
};
exports.updatePropertyHandler = updatePropertyHandler;
const deletePropertyHandler = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        await (0, property_service_1.deleteProperty)(req.params.id, req.user._id.toString());
        res.json({ message: 'Property removed' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
};
exports.deletePropertyHandler = deletePropertyHandler;
const searchPropertiesHandler = async (req, res) => {
    try {
        const result = await (0, property_service_1.searchProperties)(req.query);
        res.json(result);
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        }
        else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
};
exports.searchPropertiesHandler = searchPropertiesHandler;
