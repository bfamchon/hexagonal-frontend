import { ProfileFollowers } from '@/pages/Profile/ProfileFollowers';
import { createProfileFollowersLoader } from '@/pages/Profile/ProfileFollowers/create-profile-followers-loader';
import { createProfileFollowingLoader } from '@/pages/Profile/ProfileFollowing/create-profile-following-loader';
import { ProfileFollowing } from '@/pages/Profile/ProfileFollowing/ProfileFollowing';
import { createBrowserRouter } from 'react-router-dom';
import { AppStore } from './lib/create-store';
import { createHomeLoader } from './pages/Home/create-home-loader';
import { Home } from './pages/Home/Home';
import { Login } from './pages/Login';
import { ProfileLayout } from './pages/Profile/ProfileLayout';
import { ProfileTimeline } from './pages/Profile/ProfileTimeline';
import { createProfileTimelineLoader } from './pages/Profile/ProfileTimeline/create-profile-timeline-loader';
import { ProtectedPageLayout } from './pages/ProtectedPageLayout';
import { RedirectHomePage } from './pages/RedirectHomePage';

export const createRouter = (
  { store }: { store: AppStore },
  createRouterFn = createBrowserRouter,
) =>
  createRouterFn([
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/',
      element: <ProtectedPageLayout />,
      children: [
        {
          index: true,
          element: <RedirectHomePage />,
        },
        {
          path: 'home',
          loader: createHomeLoader({ store }),
          element: <Home />,
        },
        {
          path: 'u/:userId',
          element: <ProfileLayout />,
          children: [
            {
              index: true,
              element: <ProfileTimeline />,
              loader: createProfileTimelineLoader({ store }),
            },
            {
              path: 'following',
              element: <ProfileFollowing />,
              loader: createProfileFollowingLoader({ store }),
            },
            {
              path: 'followers',
              element: <ProfileFollowers />,
              loader: createProfileFollowersLoader({ store }),
            },
          ],
        },
      ],
    },
  ]);

export type AppRouter = ReturnType<typeof createRouter>;
