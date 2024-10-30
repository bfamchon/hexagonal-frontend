import { AppStore, createTestStore } from '@/lib/create-store';
import { stateBuilder } from '@/lib/state-builder';
import { FakeUserGateway } from '@/lib/users/infra/fake-user.gateway';
import { getUserFollowers } from '@/lib/users/usecases/get-user-followers.use-case';
import { getUserFollowing } from '@/lib/users/usecases/get-user-following.use-case';
import { expect } from 'vitest';

export const createUsersFixture = () => {
  let store: AppStore;
  const userGateway = new FakeUserGateway();
  return {
    givenFollowers: ({
      of,
      followers,
    }: {
      of: string;
      followers: string[];
    }) => {
      userGateway.givenFollowersResponse({ of, followers });
    },
    givenFollowing: ({
      of,
      following,
    }: {
      of: string;
      following: string[];
    }) => {
      userGateway.givenFollowingResponse({ of, following });
    },
    whenRetrievingFollowersOf: async (username: string) => {
      store = createTestStore({ userGateway });
      return store.dispatch(getUserFollowers({ userId: username }));
    },
    whenRetrievingFollowingOf: async (username: string) => {
      store = createTestStore({ userGateway });
      return store.dispatch(getUserFollowing({ userId: username }));
    },
    thenFollowersShouldBeLoading: ({ of }: { of: string }) => {
      const expectedState = stateBuilder().withFollowersLoading({ of }).build();
      expect(expectedState).toEqual(store.getState());
    },
    thenFollowingShouldBeLoading: ({ of }: { of: string }) => {
      const expectedState = stateBuilder().withFollowingLoading({ of }).build();
      expect(expectedState).toEqual(store.getState());
    },
    thenFollowersShouldBe: ({
      of,
      followers,
    }: {
      of: string;
      followers: string[];
    }) => {
      const expectedState = stateBuilder()
        .withFollowers({
          of,
          followers,
        })
        .withFollowersNotLoading({ of })
        .build();
      expect(expectedState).toEqual(store.getState());
    },
    thenFollowingShouldBe: ({
      of,
      following,
    }: {
      of: string;
      following: string[];
    }) => {
      const expectedState = stateBuilder()
        .withFollowing({
          of,
          following,
        })
        .withFollowingNotLoading({ of })
        .build();
      expect(expectedState).toEqual(store.getState());
    },
  };
};

export type UsersFixture = ReturnType<typeof createUsersFixture>;
