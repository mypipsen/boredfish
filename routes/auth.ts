import { Router } from 'express';
import { toNodeHandler } from 'better-auth/node';

import { auth } from '../services/auth.ts';

const router = Router();

router.all('/auth/*splat', toNodeHandler(auth));

export default router;
