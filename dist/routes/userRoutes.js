"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.json({ message: 'Users route works!' });
});
router.post('/register', user_controller_1.registerUserHandler);
router.post('/login', user_controller_1.authUserHandler);
router.route('/profile')
    .get(auth_1.protect, user_controller_1.getUserProfileHandler)
    .put(auth_1.protect, user_controller_1.updateUserProfileHandler);
router.route('/favorites/:propertyId')
    .post(auth_1.protect, user_controller_1.addFavoriteHandler)
    .delete(auth_1.protect, user_controller_1.removeFavoriteHandler);
router.post('/recommend', auth_1.protect, user_controller_1.recommendPropertyHandler);
router.get('/recommendations', auth_1.protect, user_controller_1.getRecommendationsHandler);
router.get('/test', (req, res) => {
    res.json({ message: "User routes are working!" });
});
exports.default = router;
