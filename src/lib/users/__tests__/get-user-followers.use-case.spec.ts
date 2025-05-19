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
  test('Example: retrieving Bob s followers', async () => {
    fixture.givenExistingUsers([
      {
        id: 'alice-id',
        username: 'Alice',
        profilePicture: 'alice.png',
        followersCount: 5,
        followingCount: 10,
      },
    ]);

    fixture.givenFollowers({
      of: 'Bob',
      followers: [
        {
          id: 'alice-id',
          username: 'Alice__',
          profilePicture: 'alice-2.png',
          followersCount: 10,
          followingCount: 10,
        },
        {
          id: 'charles-id',
          username: 'Charles',
          profilePicture: 'charles.png',
          followersCount: 3,
          followingCount: 5,
        },
      ],
    });

    const followersRetrieving = fixture.whenRetrievingFollowersOf('Bob');

    fixture.thenFollowersShouldBeLoading({ of: 'Bob' });
    await followersRetrieving;

    fixture.thenFollowersShouldBe({
      of: 'Bob',
      followers: [
        {
          id: 'alice-id',
          username: 'Alice__',
          profilePicture: 'alice-2.png',
          followersCount: 10,
          followingCount: 10,
        },
        {
          id: 'charles-id',
          username: 'Charles',
          profilePicture: 'charles.png',
          followersCount: 3,
          followingCount: 5,
        },
      ],
    });
  });
});
