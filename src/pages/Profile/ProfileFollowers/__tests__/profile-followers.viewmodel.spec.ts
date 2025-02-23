import { stateBuilder } from '@/lib/state-builder';
import {
  createProfileFollowersViewModel,
  ProfileFollowersViewModelType,
} from '@/pages/Profile/ProfileFollowers/profile-followers.viewmodel';
import { describe, expect, test } from 'vitest';

describe('Profile followers view model for Bob', () => {
  test('Example: followers are loading', () => {
    const state = stateBuilder()
      .withFollowersLoading({ of: 'Baptiste' })
      .build();
    const profileFollowersViewModel = createProfileFollowersViewModel({
      of: 'Baptiste',
    })(state);
    expect(profileFollowersViewModel).toEqual({
      type: ProfileFollowersViewModelType.LoadingFollowers,
    });
  });

  test('Example: followers are loaded', () => {
    const state = stateBuilder()
      .withFollowers({ of: 'Baptiste', followers: ['bob', 'alice'] })
      .build();

    const profileFollowersViewModel = createProfileFollowersViewModel({
      of: 'Baptiste',
    })(state);
    expect(profileFollowersViewModel).toEqual({
      type: ProfileFollowersViewModelType.LoadedFollowers,
      followers: [
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
