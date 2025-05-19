import { RootState } from '@/lib/create-store';
import {
  selectAreFollowersLoading,
  selectFollowersOfUser,
} from '@/lib/users/slices/relationships.slice';
import { selectUser } from '@/lib/users/slices/users.slice';

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
        followersCount: number;
        followingCount: number;
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
      followers: followers
        .map((followerId) => {
          const user = selectUser(followerId, rootState);
          if (!user) {
            return null;
          }
          return {
            id: followerId,
            username: user.username,
            followersCount: user.followersCount,
            followingCount: user.followingCount,
            profilePicture: user.profilePicture,
            link: `/u/${followerId}`,
          };
        })
        .filter(Boolean),
    };
  };
