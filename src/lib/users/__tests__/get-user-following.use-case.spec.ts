import {
  createUsersFixture,
  UsersFixture,
} from '@/lib/users/__tests__/users.fixture';
import { beforeEach, describe, test } from 'vitest';

describe('Feature: Getting user following', () => {
  let fixture: UsersFixture;
  beforeEach(() => {
    fixture = createUsersFixture();
  });

  test('Example: retrieving the 10s Bob following', async () => {
    fixture.givenFollowing({
      of: 'Bob',
      following: [
        'f1-id',
        'f2-id',
        'f3-id',
        'f4-id',
        'f5-id',
        'f6-id',
        'f7-id',
        'f8-id',
        'f9-id',
        'f10-id',
      ],
    });

    const followingRetrieving = fixture.whenRetrievingFollowingOf('Bob');

    fixture.thenFollowingShouldBeLoading({ of: 'Bob' });
    await followingRetrieving;

    fixture.thenFollowingShouldBe({
      of: 'Bob',
      following: [
        'f1-id',
        'f2-id',
        'f3-id',
        'f4-id',
        'f5-id',
        'f6-id',
        'f7-id',
        'f8-id',
        'f9-id',
        'f10-id',
      ],
    });
  });
});
