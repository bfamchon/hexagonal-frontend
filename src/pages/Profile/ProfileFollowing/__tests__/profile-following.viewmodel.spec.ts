import { stateBuilder } from '@/lib/state-builder';
import {
  createProfileFollowingViewModel,
  ProfileFollowingViewModelType,
} from '@/pages/Profile/ProfileFollowing/profile-following.viewmodel';
import { describe, expect, test } from 'vitest';

describe('Profile following view model for Bob', () => {
  test('Example: following are loading', () => {
    const state = stateBuilder()
      .withFollowingLoading({ of: 'Baptiste' })
      .build();
    const profileFollowingViewModel = createProfileFollowingViewModel({
      of: 'Baptiste',
    })(state);
    expect(profileFollowingViewModel).toEqual({
      type: ProfileFollowingViewModelType.LoadingFollowing,
    });
  });

  test('Example: following are loaded', () => {
    const state = stateBuilder()
      .withFollowing({ of: 'Baptiste', following: ['bob', 'alice'] })
      .withUsers([
        {
          id: 'bob',
          username: 'bob',
          profilePicture: 'bob.png',
          followersCount: 5,
          followingCount: 10,
        },
        {
          id: 'alice',
          username: 'alice',
          profilePicture: 'alice.png',
          followersCount: 5,
          followingCount: 10,
        },
      ])
      .build();

    const profileFollowingViewModel = createProfileFollowingViewModel({
      of: 'Baptiste',
    })(state);
    expect(profileFollowingViewModel).toEqual({
      type: ProfileFollowingViewModelType.LoadedFollowing,
      following: [
        {
          id: 'bob',
          username: 'bob',
          profilePicture: 'bob.png',
          followersCount: 5,
          followingCount: 10,
          link: '/u/bob',
        },
        {
          id: 'alice',
          username: 'alice',
          profilePicture: 'alice.png',
          followersCount: 5,
          followingCount: 10,
          link: '/u/alice',
        },
      ],
    });
  });
});
