/* メインAPI */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { csrf } from 'hono/csrf';
import { logger } from 'hono/logger';
import wolRoute from './route/wol';
import deviceRoute from './route/device';
import userRoute from './route/user';
import controlRoute from './route/control';

const app = new Hono();

app.use('*', logger());
app.use('*', cors());
app.use('*', csrf());

export const route = app
    .route('/api/wol', wolRoute)
    .route('/api/device', deviceRoute)
    .route('/api/user', userRoute)
    .route('/api/control', controlRoute);

export type AppType = typeof route;
export default app;
