"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const env_path = path_1.default.join(__dirname, '../.env');
(0, dotenv_1.config)({ path: env_path });
exports.appConfig = {
    server: {
        port: process.env.PORT || 3000,
    },
    client: {
        url: process.env.CLIENT_URL || 'http://localhost:3000',
    },
};
