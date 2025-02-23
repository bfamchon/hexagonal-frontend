import { AppStore } from '@/lib/create-store';
import { getUserFollowing } from '@/lib/users/usecases/get-user-following.use-case';
import { LoaderFunction } from 'react-router-dom';

export const createProfileFollowingLoader =
  ({ store }: { store: AppStore }): LoaderFunction =>
  ({ params }) => {
    const userId = params.userId as string;
    store.dispatch(getUserFollowing({ userId }));

    return null;
  };
