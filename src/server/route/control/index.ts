/* controlルート統合用ファイル */

import { Hono } from 'hono';
import { controlSender } from './send';

const controlRoute = new Hono().route('/', controlSender);

export default controlRoute;
