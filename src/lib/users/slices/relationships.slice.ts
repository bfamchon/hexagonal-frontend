import { RootState } from '@/lib/create-store';
import { getUserFollowers } from '@/lib/users/usecases/get-user-followers.use-case';
import { getUserFollowing } from '@/lib/users/usecases/get-user-following.use-case';
import { createSlice, EntityState } from '@reduxjs/toolkit';
import {
  Relationship,
  relationshipsAdapter,
} from './../model/relationship.entity';
type RelationshipsSliceState = EntityState<Relationship> & {
  loadingFollowersOf: { [userId: string]: boolean };
  loadingFollowingOf: { [userId: string]: boolean };
};

export const relationshipsSlice = createSlice({
  name: 'relationships',
  reducers: {},
  initialState: relationshipsAdapter.getInitialState({
    loadingFollowersOf: {},
    loadingFollowingOf: {},
  }) as RelationshipsSliceState,
  extraReducers: (builder) => {
    builder
      .addCase(getUserFollowers.pending, (state, action) => {
        state.loadingFollowersOf[action.meta.arg.userId] = true;
      })
      .addCase(getUserFollowing.pending, (state, action) => {
        state.loadingFollowingOf[action.meta.arg.userId] = true;
      })
      .addCase(getUserFollowers.fulfilled, (state, action) => {
        state.loadingFollowersOf[action.meta.arg.userId] = false;
        relationshipsAdapter.addMany(
          state,
          action.payload.followers.map((follower) => ({
            user: action.meta.arg.userId,
            follows: follower.id,
          })),
        );
      })
      .addCase(getUserFollowing.fulfilled, (state, action) => {
        state.loadingFollowingOf[action.meta.arg.userId] = false;
        relationshipsAdapter.addMany(
          state,
          action.payload.following.map((following) => ({
            user: following.id,
            follows: action.meta.arg.userId,
          })),
        );
      });
  },
});

export const selectAllRelationships = (state: RootState) =>
  state.users.relationships;
export const selectFollowersOfUser = (userId: string, state: RootState) =>
  relationshipsAdapter
    .getSelectors()
    .selectAll(state.users.relationships)
    .filter((relationship) => relationship.user === userId)
    .map((relationship) => relationship.follows);

export const selectFollowingOfUser = (userId: string, state: RootState) =>
  relationshipsAdapter
    .getSelectors()
    .selectAll(state.users.relationships)
    .filter((relationship) => relationship.follows === userId)
    .map((relationship) => relationship.user);

export const selectAreFollowersLoading = (userId: string, state: RootState) =>
  state.users.relationships.loadingFollowersOf[userId] ?? false;

export const selectAreFollowingLoading = (userId: string, state: RootState) =>
  state.users.relationships.loadingFollowingOf[userId] ?? false;
