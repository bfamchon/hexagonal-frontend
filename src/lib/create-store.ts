import {
  AnyAction,
  AsyncThunk,
  Middleware,
  ThunkDispatch,
  configureStore,
  isAsyncThunkAction,
} from '@reduxjs/toolkit';

import { FakeUserGateway } from '@/lib/users/infra/fake-user.gateway';
import { UserGateway } from '@/lib/users/model/user.gateway';
import { FakeAuthGateway } from './auth/infra/fake-auth.gateway';
import { onAuthStateChangedListener } from './auth/listeners/on-auth-state-changed.listener';
import { AuthGateway } from './auth/model/auth.gateway';
import { rootReducer } from './root-reducer';
import { FakeMessageGateway } from './timelines/infra/fake-message.gateway';
import { FakeTimelineGateway } from './timelines/infra/fake-timeline.gateway';
import { RealDateProvider } from './timelines/infra/real-date-provider';
import { DateProvider } from './timelines/model/date-provider';
import { MessageGateway } from './timelines/model/message.gateway';
import { TimelineGateway } from './timelines/model/timeline.gateway';

export type Dependencies = {
  authGateway: AuthGateway;
  timelineGateway: TimelineGateway;
  messageGateway: MessageGateway;
  userGateway: UserGateway;
  dateProvider: DateProvider;
};

export const createStore = (
  dependencies: Dependencies,
  preloadedState?: Partial<RootState>,
) => {
  const actions: AnyAction[] = [];
  const logActionsMiddleware: Middleware = () => (next) => (action) => {
    actions.push(action);
    return next(action);
  };

  const store = configureStore({
    reducer: rootReducer,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: dependencies,
        },
      }).prepend(logActionsMiddleware);
    },
    preloadedState,
  });

  onAuthStateChangedListener({
    store,
    authGateway: dependencies.authGateway,
  });

  return {
    ...store,
    getActions() {
      return actions;
    },
  };
};

export const createTestStore = (
  {
    authGateway = new FakeAuthGateway(),
    timelineGateway = new FakeTimelineGateway(),
    messageGateway = new FakeMessageGateway(),
    userGateway = new FakeUserGateway(),
    dateProvider = new RealDateProvider(),
  }: Partial<Dependencies> = {},
  preloadedState?: Partial<ReturnType<typeof rootReducer>>,
) => {
  const store = createStore(
    {
      authGateway,
      timelineGateway,
      messageGateway,
      userGateway,
      dateProvider,
    },
    preloadedState,
  );

  return {
    ...store,
    getDispatchedUseCaseArgs(useCase: AsyncThunk<any, any, object>) {
      const pendingUseCaseActions = store
        .getActions()
        .find((action) => action.type === useCase.pending.toString());

      if (!pendingUseCaseActions) {
        return;
      }

      if (!isAsyncThunkAction(pendingUseCaseActions)) {
        return;
      }

      return pendingUseCaseActions.meta.arg;
    },
  };
};

type AppStoreWithGetActions = ReturnType<typeof createStore>;
export type AppStore = Omit<AppStoreWithGetActions, 'getActions'>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = ThunkDispatch<RootState, Dependencies, AnyAction>;
