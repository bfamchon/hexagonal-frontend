import { RootState } from '@/lib/create-store';
import {
  selectAreFollowingLoading,
  selectFollowingOfUser,
} from '@/lib/users/slices/relationships.slice';
import { selectUser } from '@/lib/users/slices/users.slice';

export enum ProfileFollowingViewModelType {
  LoadingFollowing = 'LOADING_FOLLOWING',
  LoadedFollowing = 'LOADED_FOLLOWING',
}

export type ProfileFollowingViewModel =
  | {
      type: ProfileFollowingViewModelType.LoadingFollowing;
    }
  | {
      type: ProfileFollowingViewModelType.LoadedFollowing;
      following: {
        id: string;
        username: string;
        profilePicture: string;
        followersCount: number;
        followingCount: number;
        link: string;
      }[];
    };

export const createProfileFollowingViewModel =
  ({ of }: { of: string }) =>
  (rootState: RootState): ProfileFollowingViewModel => {
    const areFollowingLoading = selectAreFollowingLoading(of, rootState);
    if (areFollowingLoading) {
      return {
        type: ProfileFollowingViewModelType.LoadingFollowing,
      };
    }
    const followings = selectFollowingOfUser(of, rootState);

    return {
      type: ProfileFollowingViewModelType.LoadedFollowing,
      following: followings
        .map((followingId) => {
          const user = selectUser(followingId, rootState);
          if (!user) {
            return null;
          }
          return {
            id: followingId,
            username: user.username,
            followersCount: user.followersCount,
            followingCount: user.followingCount,
            profilePicture: user.profilePicture,
            link: `/u/${followingId}`,
          };
        })
        .filter(Boolean),
    };
  };
