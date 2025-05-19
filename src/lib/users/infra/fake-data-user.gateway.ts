import { followersByUser, followingByUser, users } from '@/lib/fake-data';
import {
  GetUserFollowersResponse,
  GetUserFollowingResponse,
  UserGateway,
} from '@/lib/users/model/user.gateway';

export class FakeDataUserGateway implements UserGateway {
  getUserFollowers(params: {
    userId: string;
  }): Promise<GetUserFollowersResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const followers = followersByUser.get(params.userId);

        if (!followers) {
          return resolve({
            followers: [],
          });
        }
        resolve({
          followers: followers
            .map((userId) => {
              const user = users.get(userId);
              if (!user) {
                return null;
              }
              return {
                id: userId,
                username: user.username,
                profilePicture: user.profilePicture,
                followersCount: followersByUser.get(userId)?.length ?? 0,
                followingCount: followingByUser.get(userId)?.length ?? 0,
              };
            })
            .filter(Boolean),
        });
      }, 2000);
    });
  }
  getUserFollowing(params: {
    userId: string;
  }): Promise<GetUserFollowingResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const following = followingByUser.get(params.userId);

        if (!following) {
          return resolve({
            following: [],
          });
        }
        resolve({
          following: following
            .map((userId) => {
              const user = users.get(userId);
              if (!user) {
                return null;
              }
              return {
                id: userId,
                username: user.username,
                profilePicture: user.profilePicture,
                followersCount: followersByUser.get(userId)?.length ?? 0,
                followingCount: followingByUser.get(userId)?.length ?? 0,
              };
            })
            .filter(Boolean),
        });
      }, 2000);
    });
  }
}
