import { User } from '@/lib/users/model/user.entity';

export type GetUserFollowersResponse = {
  followers: User[];
};
export type GetUserFollowingResponse = {
  following: User[];
};
export interface UserGateway {
  getUserFollowers(params: {
    userId: string;
  }): Promise<GetUserFollowersResponse>;
  getUserFollowing(params: {
    userId: string;
  }): Promise<GetUserFollowingResponse>;
}
