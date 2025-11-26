import { toNodeHandler } from 'better-auth/node';
import { Router } from 'express';

import { auth } from '../services/auth.js';

const router = Router();

router.all('/auth/*splat', toNodeHandler(auth));

export default router;
