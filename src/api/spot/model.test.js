import { Spot } from '.';
import { User } from '../user';

let user, spot;

beforeEach(async () => {
  user = await User.create({
    email: 'a@a.com',
    password: '123456',
    phone: '0600000000'
  });
  spot = await Spot.create({
    user,
    location: [-73.856077, 40.848447],
    photo: 'test'
  });
});

describe('view', () => {
  it('returns simple view', () => {
    const view = spot.view();
    expect(typeof view).toBe('object');
    expect(view.id).toBe(spot.id);
    expect(typeof view.user).toBe('object');
    expect(view.user.id).toBe(user.id);
    expect(view.location).toBe(spot.location);
    expect(view.photo).toBe(spot.photo);
    expect(view.createdAt).toBeTruthy();
    expect(view.updatedAt).toBeTruthy();
  });

  it('returns full view', () => {
    const view = spot.view(true);
    expect(typeof view).toBe('object');
    expect(view.id).toBe(spot.id);
    expect(typeof view.user).toBe('object');
    expect(view.user.id).toBe(user.id);
    expect(view.location).toBe(spot.location);
    expect(view.photo).toBe(spot.photo);
    expect(view.createdAt).toBeTruthy();
    expect(view.updatedAt).toBeTruthy();
  });
});
