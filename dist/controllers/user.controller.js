"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendationsHandler = exports.recommendPropertyHandler = exports.removeFavoriteHandler = exports.addFavoriteHandler = exports.updateUserProfileHandler = exports.getUserProfileHandler = exports.authUserHandler = exports.registerUserHandler = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_service_1 = require("../services/user.service");
const registerUserHandler = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await (0, user_service_1.registerUser)(name, email, password);
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
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
exports.registerUserHandler = registerUserHandler;
const authUserHandler = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await (0, user_service_1.authUser)(email, password);
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d'
        });
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        }
        else {
            res.status(401).json({ message: 'An unknown error occurred' });
        }
    }
};
exports.authUserHandler = authUserHandler;
const getUserProfileHandler = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const user = await (0, user_service_1.getUserProfile)(req.user._id.toString());
        res.json(user);
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
exports.getUserProfileHandler = getUserProfileHandler;
const updateUserProfileHandler = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const user = await (0, user_service_1.updateUserProfile)(req.user._id.toString(), req.body);
        res.json(user);
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
exports.updateUserProfileHandler = updateUserProfileHandler;
const addFavoriteHandler = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const user = await (0, user_service_1.addFavorite)(req.user._id.toString(), req.params.propertyId);
        res.json(user);
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
exports.addFavoriteHandler = addFavoriteHandler;
const removeFavoriteHandler = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const user = await (0, user_service_1.removeFavorite)(req.user._id.toString(), req.params.propertyId);
        res.json(user);
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
exports.removeFavoriteHandler = removeFavoriteHandler;
const recommendPropertyHandler = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const { recipientEmail, propertyId } = req.body;
        await (0, user_service_1.recommendProperty)(req.user._id.toString(), recipientEmail, propertyId);
        res.json({ message: 'Property recommended successfully' });
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
exports.recommendPropertyHandler = recommendPropertyHandler;
const getRecommendationsHandler = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'Not authorized' });
            return;
        }
        const recommendations = await (0, user_service_1.getRecommendations)(req.user._id.toString());
        res.json(recommendations);
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
exports.getRecommendationsHandler = getRecommendationsHandler;
