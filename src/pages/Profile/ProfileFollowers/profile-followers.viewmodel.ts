import { RootState } from '@/lib/create-store';
import {
  selectAreFollowersLoading,
  selectFollowersOfUser,
} from '@/lib/users/slices/relationships.slice';

export enum ProfileFollowersViewModelType {
  LoadingFollowers = 'LOADING_FOLLOWERS',
  LoadedFollowers = 'LOADED_FOLLOWERS',
}

export type ProfileFollowersViewModel =
  | {
      type: ProfileFollowersViewModelType.LoadingFollowers;
    }
  | {
      type: ProfileFollowersViewModelType.LoadedFollowers;
      followers: {
        id: string;
        username: string;
        profilePicture: string;
        link: string;
      }[];
    };

export const createProfileFollowersViewModel =
  ({ of }: { of: string }) =>
  (rootState: RootState): ProfileFollowersViewModel => {
    const areFollowersLoading = selectAreFollowersLoading(of, rootState);
    if (areFollowersLoading) {
      return {
        type: ProfileFollowersViewModelType.LoadingFollowers,
      };
    }
    const followers = selectFollowersOfUser(of, rootState);

    return {
      type: ProfileFollowersViewModelType.LoadedFollowers,
      followers: followers.map((follower) => ({
        id: follower,
        username: follower,
        profilePicture: 'https://picsum.photos/200',
        link: `/u/${follower}`,
      })),
    };
  };
