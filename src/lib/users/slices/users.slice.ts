import { RootState } from '@/lib/create-store';
import { userAdapter } from '@/lib/users/model/user.entity';
import { getUserFollowers } from '@/lib/users/usecases/get-user-followers.use-case';
import { getUserFollowing } from '@/lib/users/usecases/get-user-following.use-case';
import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'users',
  initialState: userAdapter.getInitialState(),
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getUserFollowers.fulfilled, (state, action) => {
      userAdapter.upsertMany(state, action.payload.followers);
    });
    builder.addCase(getUserFollowing.fulfilled, (state, action) => {
      userAdapter.upsertMany(state, action.payload.following);
    });
  },
});

export const selectUser = (userId: string, state: RootState) => {
  const user = userAdapter.getSelectors().selectById(state.users.users, userId);
  return user;
};
