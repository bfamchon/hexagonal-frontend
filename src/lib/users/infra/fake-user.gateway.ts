import { User } from '@/lib/users/model/user.entity';
import {
  GetUserFollowersResponse,
  GetUserFollowingResponse,
  UserGateway,
} from '@/lib/users/model/user.gateway';

export class FakeUserGateway implements UserGateway {
  willReturnFollowersOf = new Map<string, GetUserFollowersResponse>();
  willReturnFollowingOf = new Map<string, GetUserFollowingResponse>();

  async getUserFollowers(params: { userId: string }) {
    const response = this.willReturnFollowersOf.get(params.userId);
    if (!response) {
      return Promise.reject();
    }
    return Promise.resolve(response);
  }
  async getUserFollowing(params: { userId: string }) {
    const response = this.willReturnFollowingOf.get(params.userId);
    if (!response) {
      return Promise.reject();
    }
    return Promise.resolve(response);
  }
  givenFollowersResponse({ of, followers }: { of: string; followers: User[] }) {
    this.willReturnFollowersOf.set(of, {
      followers,
    });
  }

  givenFollowingResponse({ of, following }: { of: string; following: User[] }) {
    this.willReturnFollowingOf.set(of, {
      following,
    });
  }
}
