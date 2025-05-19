import { AppStore, createTestStore } from '@/lib/create-store';
import { stateBuilder } from '@/lib/state-builder';
import { FakeUserGateway } from '@/lib/users/infra/fake-user.gateway';
import { User } from '@/lib/users/model/user.entity';
import {
  selectAreFollowersLoading,
  selectAreFollowingLoading,
} from '@/lib/users/slices/relationships.slice';
import { getUserFollowers } from '@/lib/users/usecases/get-user-followers.use-case';
import { getUserFollowing } from '@/lib/users/usecases/get-user-following.use-case';
import { expect } from 'vitest';

export const createUsersFixture = () => {
  let store: AppStore;
  const userGateway = new FakeUserGateway();
  let currentStateBuilder = stateBuilder();
  return {
    givenFollowers: ({ of, followers }: { of: string; followers: User[] }) => {
      userGateway.givenFollowersResponse({ of, followers });
    },
    givenFollowing: ({ of, following }: { of: string; following: User[] }) => {
      userGateway.givenFollowingResponse({ of, following });
    },
    givenExistingUsers: (users: User[]) => {
      currentStateBuilder = currentStateBuilder.withUsers(users);
    },
    whenRetrievingFollowersOf: async (username: string) => {
      store = createTestStore({ userGateway }, currentStateBuilder.build());
      return store.dispatch(getUserFollowers({ userId: username }));
    },
    whenRetrievingFollowingOf: async (username: string) => {
      store = createTestStore({ userGateway }, currentStateBuilder.build());
      return store.dispatch(getUserFollowing({ userId: username }));
    },
    thenFollowersShouldBeLoading: ({ of }: { of: string }) => {
      const isLoading = selectAreFollowersLoading(of, store.getState());
      expect(isLoading).toEqual(true);
    },
    thenFollowingShouldBeLoading: ({ of }: { of: string }) => {
      const isLoading = selectAreFollowingLoading(of, store.getState());
      expect(isLoading).toEqual(true);
    },
    thenFollowersShouldBe: ({
      of,
      followers,
    }: {
      of: string;
      followers: User[];
    }) => {
      const expectedState = stateBuilder()
        .withFollowers({
          of,
          followers: followers.map((f) => f.id),
        })
        .withUsers(followers)
        .withFollowersNotLoading({ of })
        .build();
      expect(expectedState).toEqual(store.getState());
    },
    thenFollowingShouldBe: ({
      of,
      following,
    }: {
      of: string;
      following: User[];
    }) => {
      const expectedState = stateBuilder()
        .withFollowing({
          of,
          following: following.map((f) => f.id),
        })
        .withUsers(following)
        .withFollowingNotLoading({ of })
        .build();
      expect(expectedState).toEqual(store.getState());
    },
  };
};

export type UsersFixture = ReturnType<typeof createUsersFixture>;
