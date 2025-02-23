import { followersByUser } from '@/lib/fake-data';
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
          followers: followers.map((userId) => ({
            id: userId,
          })),
        });
      }, 2000);
    });
  }
  getUserFollowing(params: {
    userId: string;
  }): Promise<GetUserFollowingResponse> {
    throw new Error('Method not implemented.');
  }
}
