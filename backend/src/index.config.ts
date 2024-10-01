import { config } from "dotenv";
import path from 'path';

const env_path = path.join(__dirname, '../.env');
config({path: env_path});

export const appConfig = {
    server: {
        port: process.env.PORT || 4000,
    },
    client: {
        url: process.env.CLIENT_URL || 'http://localhost:3000',
    },
}