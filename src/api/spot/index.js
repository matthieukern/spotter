import { Router } from 'express';
import { middleware as query } from 'querymen';
import { middleware as body } from 'bodymen';
import { token } from '../../services/passport';
import { create, index, show, update, destroy } from './controller';
import { schema } from './model';
export Spot, { schema } from './model';

const router = new Router();
const { location, photo } = schema.tree;

/**
 * @api {post} /spots Create spot
 * @apiName CreateSpot
 * @apiGroup Spot
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam location Spot's location.
 * @apiParam photo Spot's photo base64 data.
 * @apiSuccess {Object} spot Spot's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Spot not found.
 * @apiError 401 user access only.
 */
router.post('/', token({ required: true }), body({ location, photo }), create);

/**
 * @api {get} /spots Retrieve spots
 * @apiName RetrieveSpots
 * @apiGroup Spot
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam {Number[]} near The coordinates near where to find spots.
 * @apiParam {Number} [min_distance] The minimum distance between the position and the spot.
 * @apiParam {Number} [max_distance] The maximum distance between the position and the spot.
 * @apiUse listParams
 * @apiParamExample {get} Request example:
 *    /spots?near=48.8596019,2.3828995000000077&min_distance=200&max_distance=2000
 * @apiSuccess {Object[]} spots List of spots.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 user access only.
 */
router.get('/', token({ required: true }), query({}, { near: true }), index);

/**
 * @api {get} /spots/:id Retrieve spot
 * @apiName RetrieveSpot
 * @apiGroup Spot
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess {Object} spot Spot's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Spot not found.
 * @apiError 401 user access only.
 */
router.get('/:id', token({ required: true }), show);

/**
 * @api {put} /spots/:id Update spot
 * @apiName UpdateSpot
 * @apiGroup Spot
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam location Spot's location.
 * @apiParam photo Spot's photo base64 data.
 * @apiSuccess {Object} spot Spot's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Spot not found.
 * @apiError 401 user access only.
 */
router.put(
  '/:id',
  token({ required: true }),
  body({ location, photo }),
  update
);

/**
 * @api {delete} /spots/:id Delete spot
 * @apiName DeleteSpot
 * @apiGroup Spot
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Spot not found.
 * @apiError 401 user access only.
 */
router.delete('/:id', token({ required: true }), destroy);

export default router;
