import express, { Request, Response } from 'express';
import cors from 'cors';
import { appConfig } from './index.config';

const server = () => {
    const app = express();
    app.use(express.json());
    app.use(cors({
        origin: appConfig.client.url,
        credentials: true
    }));

    app.get('/', (req: Request, res: Response) => {
        res.send('Hello, World!');
    });

    // setup API endpoints
    // app.use(...)

    return app;
}

const app = server();
const port = appConfig.server.port as number || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
