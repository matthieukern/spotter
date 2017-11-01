import _ from 'lodash';
import { success, notFound, author } from '../../services/response/';
import { Spot } from '.';

export const create = ({ user, bodymen: { body } }, res, next) =>
  Spot.create({ ...body, user })
    .then(spot => spot.view(true))
    .then(success(res, 201))
    .catch(next);

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Spot.find(query, select, cursor)
    .populate('user')
    .then(spots => spots.map(spot => spot.view()))
    .then(success(res))
    .catch(next);

export const show = ({ params }, res, next) =>
  Spot.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(spot => (spot ? spot.view() : null))
    .then(success(res))
    .catch(next);

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Spot.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(author(res, user, 'user'))
    .then(spot => (spot ? _.merge(spot, body).save() : null))
    .then(spot => (spot ? spot.view(true) : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ user, params }, res, next) =>
  Spot.findById(params.id)
    .then(notFound(res))
    .then(author(res, user, 'user'))
    .then(spot => (spot ? spot.remove() : null))
    .then(success(res, 204))
    .catch(next);
