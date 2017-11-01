import { User } from '.';

let user;

beforeEach(async () => {
  user = await User.create({
    name: 'user',
    email: 'a@a.com',
    password: '123456',
    phone: '0600000000'
  });
});

describe('set email', () => {
  it('sets name automatically', () => {
    user.name = '';
    user.email = 'test@example.com';
    expect(user.name).toBe('test');
  });

  it('does not change picture when it is already set and is not gravatar', () => {
    user.picture = 'not_gravatar.jpg';
    user.email = 'c@c.com';
    expect(user.picture).toBe('not_gravatar.jpg');
  });
});

describe('view', () => {
  it('returns simple view', () => {
    const view = user.view();
    expect(view).toBeDefined();
    expect(view.id).toBe(user.id);
    expect(view.name).toBe(user.name);
    expect(view.email).toBe(user.email);
    expect(view.phone).toBe(user.phone);
    expect(view.createdAt).toEqual(user.createdAt);
  });
});

describe('authenticate', () => {
  it('returns the user when authentication succeed', async () => {
    expect(await user.authenticate('123456')).toBe(user);
  });

  it('returns false when authentication fails', async () => {
    expect(await user.authenticate('blah')).toBe(false);
  });
});
