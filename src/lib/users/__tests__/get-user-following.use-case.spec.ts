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

  test('Example: retrieving Bob s following', async () => {
    fixture.givenExistingUsers([
      {
        id: 'alice-id',
        username: 'Alice',
        profilePicture: 'alice.png',
        followersCount: 5,
        followingCount: 10,
      },
    ]);
    fixture.givenFollowing({
      of: 'Bob',
      following: [
        {
          id: 'alice-id',
          username: 'Aliceasdas',
          profilePicture: 'aliceasdas.png',
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

    const followingRetrieving = fixture.whenRetrievingFollowingOf('Bob');

    fixture.thenFollowingShouldBeLoading({ of: 'Bob' });
    await followingRetrieving;

    fixture.thenFollowingShouldBe({
      of: 'Bob',
      following: [
        {
          id: 'alice-id',
          username: 'Aliceasdas',
          profilePicture: 'aliceasdas.png',
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
