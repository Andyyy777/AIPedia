"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const index_config_1 = require("./index.config");
const server = () => {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, cors_1.default)({
        origin: index_config_1.appConfig.client.url,
        credentials: true
    }));
    let port = 3000;
    app.get('/', (req, res) => {
        res.send('Hello, World!');
    });
    // setup API endpoints
    // app.use(...)
    return app;
};
const app = server();
const port = index_config_1.appConfig.server.port || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
