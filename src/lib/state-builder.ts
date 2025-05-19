import { relationshipsAdapter } from '@/lib/users/model/relationship.entity';
import { User, userAdapter } from '@/lib/users/model/user.entity';
import {
  ActionCreatorWithPayload,
  createAction,
  createReducer,
} from '@reduxjs/toolkit';
import { RootState } from './create-store';
import { rootReducer } from './root-reducer';
import { Message, messagesAdapter } from './timelines/model/message.entity';
import { Timeline, timelinesAdapter } from './timelines/model/timeline.entity';

const initialState = rootReducer(undefined, createAction(''));

const withAuthUser = createAction<{ authUser: string }>('withAuthUser');
const withTimeline = createAction<Timeline>('withTimeline');
const withLoadingTimelineOf = createAction<{ user: string }>(
  'withLoadingTimelineOf',
);
const withNotLoadingTimelineOf = createAction<{ user: string }>(
  'withNotLoadingTimelineOf',
);
const withMessages = createAction<Message[]>('withMessages');
const withMessageNotPosted = createAction<{ messageId: string; error: string }>(
  'withMessageNotPosted',
);
const withoutMessageNotPosted = createAction('withoutMessageNotPosted');
const withFollowers = createAction<{ of: string; followers: string[] }>(
  'withFollowers',
);
const withFollowersNotLoading = createAction<{ of: string }>(
  'withFollowersNotLoading',
);
const withFollowersLoading = createAction<{ of: string }>(
  'withFollowersLoading',
);

const withFollowing = createAction<{ of: string; following: string[] }>(
  'withFollowing',
);
const withFollowingNotLoading = createAction<{ of: string }>(
  'withFollowingNotLoading',
);
const withFollowingLoading = createAction<{ of: string }>(
  'withFollowingLoading',
);
const withUsers = createAction<User[]>('withUsers');

const reducer = createReducer(initialState, (builder) => {
  builder
    .addCase(withAuthUser, (state, action) => {
      state.auth.authUser = action.payload.authUser;
    })
    .addCase(withTimeline, (state, action) => {
      timelinesAdapter.upsertOne(state.timelines.timelines, action.payload);
    })
    .addCase(withLoadingTimelineOf, (state, action) => {
      state.timelines.timelines.loadingTimelinesByUser[action.payload.user] =
        true;
    })
    .addCase(withNotLoadingTimelineOf, (state, action) => {
      state.timelines.timelines.loadingTimelinesByUser[action.payload.user] =
        false;
    })
    .addCase(withMessages, (state, action) => {
      messagesAdapter.addMany(state.timelines.messages, action.payload);
    })
    .addCase(withMessageNotPosted, (state, action) => {
      state.timelines.messages.messagesNotPosted[action.payload.messageId] =
        action.payload.error;
    })
    .addCase(withoutMessageNotPosted, (state) => {
      state.timelines.messages.messagesNotPosted = {};
    })
    .addCase(withFollowers, (state, action) => {
      relationshipsAdapter.addMany(
        state.users.relationships,
        action.payload.followers.map((follower) => ({
          user: action.payload.of,
          follows: follower,
        })),
      );
    })
    .addCase(withFollowersNotLoading, (state, action) => {
      state.users.relationships.loadingFollowersOf[action.payload.of] = false;
    })
    .addCase(withFollowersLoading, (state, action) => {
      state.users.relationships.loadingFollowersOf[action.payload.of] = true;
    })
    .addCase(withFollowing, (state, action) => {
      relationshipsAdapter.addMany(
        state.users.relationships,
        action.payload.following.map((following) => ({
          user: following,
          follows: action.payload.of,
        })),
      );
    })
    .addCase(withFollowingNotLoading, (state, action) => {
      state.users.relationships.loadingFollowingOf[action.payload.of] = false;
    })
    .addCase(withFollowingLoading, (state, action) => {
      state.users.relationships.loadingFollowingOf[action.payload.of] = true;
    })
    .addCase(withUsers, (state, action) => {
      state.users.users = userAdapter.addMany(
        state.users.users,
        action.payload,
      );
    });
});

export const stateBuilder = (baseState = initialState) => {
  const reduce =
    <P>(actionCreator: ActionCreatorWithPayload<P>) =>
    (payload: P) => {
      return stateBuilder(reducer(baseState, actionCreator(payload)));
    };

  return {
    withAuthUser: reduce(withAuthUser),
    withTimeline: reduce(withTimeline),
    withMessageNotPosted: reduce(withMessageNotPosted),
    withLoadingTimelineOf: reduce(withLoadingTimelineOf),
    withNotLoadingTimelineOf: reduce(withNotLoadingTimelineOf),
    withMessages: reduce(withMessages),
    withoutMessageNotPosted: reduce(withoutMessageNotPosted),
    withFollowers: reduce(withFollowers),
    withFollowersNotLoading: reduce(withFollowersNotLoading),
    withFollowersLoading: reduce(withFollowersLoading),
    withFollowing: reduce(withFollowing),
    withFollowingNotLoading: reduce(withFollowingNotLoading),
    withFollowingLoading: reduce(withFollowingLoading),
    withUsers: reduce(withUsers),
    build(): RootState {
      return baseState;
    },
  };
};

export const stateBuilderProvider = () => {
  let builder = stateBuilder();
  return {
    getState() {
      return builder.build();
    },
    setState(updateFn: (_builder: StateBuilder) => StateBuilder) {
      builder = updateFn(builder);
    },
  };
};

export type StateBuilder = ReturnType<typeof stateBuilder>;
export type StateBuilderProvider = ReturnType<typeof stateBuilderProvider>;
