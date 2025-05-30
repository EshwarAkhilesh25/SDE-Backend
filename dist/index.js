"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const redis_1 = require("./config/redis");
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    await (0, db_1.default)();
    await (0, redis_1.connectRedis)();
    app_1.default.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        console.log(`Server running at http://localhost:${PORT}`);
    });
};
startServer().catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
