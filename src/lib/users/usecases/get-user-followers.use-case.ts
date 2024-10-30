import { createAppAsyncThunk } from '@/lib/create-app-thunk';

export type GetUserFollowersParams = {
  userId: string;
};

export const getUserFollowers = createAppAsyncThunk(
  'users/getUserFollowers',
  async (params: GetUserFollowersParams, { extra: { userGateway } }) => {
    return userGateway.getUserFollowers({ userId: params.userId });
  },
);
