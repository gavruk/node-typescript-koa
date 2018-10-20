import * as Koa from 'koa';
import * as jwt from 'koa-jwt';
import * as bodyParser from 'koa-bodyparser';
import * as helmet from 'koa-helmet';
import * as cors from '@koa/cors';
import * as dotenv from 'dotenv';
import 'reflect-metadata';

import { logger } from './logging';
import { config } from './config';
import { router } from './routes';

import * as mongoose from 'mongoose';

dotenv.config({ path: '.env' });

mongoose.connect(config.databaseUrl, { useNewUrlParser: true })
    .then(async () => {
        const app = new Koa();

        app.use(helmet());
        app.use(cors());
        app.use(logger());
        app.use(bodyParser());
        app.use(jwt({ secret: config.jwtSecret }).unless({ path: ['/', /^\/auth/] }));
        app.use(router.routes()).use(router.allowedMethods());

        app.listen(config.port);

        console.log(`Server running on port ${config.port}`);

    })
    .catch(error => console.log('Database connection error: ', error));
