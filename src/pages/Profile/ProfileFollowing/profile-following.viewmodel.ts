import { RootState } from '@/lib/create-store';
import {
  selectAreFollowingLoading,
  selectFollowingOfUser,
} from '@/lib/users/slices/relationships.slice';

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
    const followers = selectFollowingOfUser(of, rootState);

    return {
      type: ProfileFollowingViewModelType.LoadedFollowing,
      following: followers.map((follower) => ({
        id: follower,
        username: follower,
        profilePicture: 'https://picsum.photos/200',
        link: `/u/${follower}`,
      })),
    };
  };
