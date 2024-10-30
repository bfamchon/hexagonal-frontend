import {
  createUsersFixture,
  UsersFixture,
} from '@/lib/users/__tests__/users.fixture';
import { beforeEach, describe, test } from 'vitest';

describe('Feature: Getting user followers', () => {
  let fixture: UsersFixture;
  beforeEach(() => {
    fixture = createUsersFixture();
  });
  test('Example: retrieving the 10s Bob followers', async () => {
    fixture.givenFollowers({
      of: 'Bob',
      followers: [
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

    const followersRetrieving = fixture.whenRetrievingFollowersOf('Bob');

    fixture.thenFollowersShouldBeLoading({ of: 'Bob' });
    await followersRetrieving;

    fixture.thenFollowersShouldBe({
      of: 'Bob',
      followers: [
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
