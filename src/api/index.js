import { Router } from 'express';
import user from './user';
import auth from './auth';
import spot from './spot';

const router = new Router();

/**
 * @apiDefine listParams
 * @apiParam {String} [q] Query to search.
 * @apiParam {Number{1..30}} [page=1] Page number.
 * @apiParam {Number{1..100}} [limit=30] Amount of returned items.
 * @apiParam {String[]} [sort=-createdAt] Order of returned items.
 * @apiParam {String[]} [fields] Fields to be returned.
 */
router.use('/users', user);
router.use('/auth', auth);
router.use('/spots', spot);

export default router;
