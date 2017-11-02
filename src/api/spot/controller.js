import _ from 'lodash';
import request from 'request-promise';
import { onesignal } from '../../config';
import { author, notFound, success } from '../../services/response/';
import { Spot } from '.';

export const create = ({ user, bodymen: { body } }, res, next) => {
  const [lat, long] = body.location;
  request({
    method: 'POST',
    uri: 'https://onesignal.com/api/v1/notifications',
    headers: {
      Authorization: `Basic ${onesignal.restKey}`
    },
    body: {
      app_id: onesignal.appId,
      filters: [{ field: 'location', radius: 5000, lat, long }],
      contents: {
        en: `Find out the new spot from ${user.name} near you on spotter!`,
        fr: `Regardes ce que vient de poster ${user.name} près de toi sur spotter !`
      }
    },
    json: true
  }).catch(e => {
    // logged only for monitoring purpose
    console.error(e);
  });

  return Spot.create({ ...body, user })
    .then(spot => spot.view())
    .then(success(res, 201))
    .catch(next);
};

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
    .then(spot => (spot ? spot.view() : null))
    .then(success(res))
    .catch(next);

export const destroy = ({ user, params }, res, next) =>
  Spot.findById(params.id)
    .then(notFound(res))
    .then(author(res, user, 'user'))
    .then(spot => (spot ? spot.remove() : null))
    .then(success(res, 204))
    .catch(next);
