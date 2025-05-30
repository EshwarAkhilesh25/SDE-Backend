"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const property_controller_1 = require("../controllers/property.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.route('/')
    .post(auth_1.protect, property_controller_1.createPropertyHandler)
    .get(property_controller_1.searchPropertiesHandler);
router.route('/:id')
    .get(property_controller_1.getPropertyHandler)
    .put(auth_1.protect, property_controller_1.updatePropertyHandler)
    .delete(auth_1.protect, property_controller_1.deletePropertyHandler);
exports.default = router;
