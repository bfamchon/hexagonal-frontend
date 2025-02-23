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
          profilePicture: 'https://picsum.photos/200',
          link: '/u/bob',
        },
        {
          id: 'alice',
          username: 'alice',
          profilePicture: 'https://picsum.photos/200',
          link: '/u/alice',
        },
      ],
    });
  });
});
