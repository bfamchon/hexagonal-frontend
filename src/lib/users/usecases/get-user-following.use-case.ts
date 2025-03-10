import { createAppAsyncThunk } from '@/lib/create-app-thunk';

export type GetUserFollowingParams = {
  userId: string;
};

export const getUserFollowing = createAppAsyncThunk(
  'users/getUserFollowing',
  async (params: GetUserFollowingParams, { extra: { userGateway } }) => {
    return userGateway.getUserFollowing({ userId: params.userId });
  },
);
