import { FakeAuthGateway } from '@/lib/auth/infra/fake-auth.gateway';
import { AppStore, createTestStore } from '@/lib/create-store';
import { stateBuilder, stateBuilderProvider } from '@/lib/state-builder';
import { MessageGateway } from '@/lib/timelines/model/message.gateway';
import { getAuthUserTimeline } from '@/lib/timelines/usecases/get-auth-user-timeline.usecase';
import { expect } from 'vitest';
import { FakeMessageGateway } from '../infra/fake-message.gateway';
import { FakeTimelineGateway } from '../infra/fake-timeline.gateway';
import { StubDateProvider } from '../infra/stub-date-provider';
import { selectIsUserTimelineLoading } from '../slices/timelines.slice';
import { getUserTimeline } from '../usecases/get-user-timeline.usecase';
import {
  PostMessageParams,
  postMessage,
} from '../usecases/post-message.usecase';
import { FailingMessageGateway } from './../infra/failing-message.gateway';

type Timeline = {
  user: string;
  id: string;
  messages: {
    id: string;
    text: string;
    author: string;
    publishedAt: string;
  }[];
};

export const createTimelinesFixture = (
  testStateBuilderProvider = stateBuilderProvider(),
) => {
  const authGateway = new FakeAuthGateway();
  const timelineGateway = new FakeTimelineGateway();
  let messageGateway: MessageGateway = new FakeMessageGateway();
  const dateProvider = new StubDateProvider();
  let store: AppStore;

  return {
    givenNowIs(now: Date) {
      dateProvider.now = now;
    },
    givenExistingRemoteTimeline(timeline: {
      user: string;
      id: string;
      messages: {
        id: string;
        text: string;
        author: string;
        publishedAt: string;
      }[];
    }) {
      timelineGateway.timelinesByUser.set(timeline.user, timeline);
    },
    givenTimeline(timeline: Timeline) {
      testStateBuilderProvider.setState((builder) =>
        builder
          .withTimeline({
            id: timeline.id,
            user: timeline.user,
            messages: timeline.messages.map((m) => m.id),
          })
          .withMessages(timeline.messages)
          .withNotLoadingTimelineOf({ user: timeline.user }),
      );
    },
    givenMessageHasFailedToBePosted({
      messageId,
      error,
    }: {
      messageId: string;
      error: string;
    }) {
      testStateBuilderProvider.setState((builder) =>
        builder.withMessageNotPosted({ messageId, error }),
      );
    },
    givenPostingMessageFailsWithError(error: string) {
      messageGateway = new FailingMessageGateway(error);
    },
    async whenRetrievingUserTimeline(userId: string) {
      store = createTestStore(
        {
          timelineGateway,
          authGateway,
        },
        testStateBuilderProvider.getState(),
      );
      return store.dispatch(getUserTimeline({ userId }));
    },
    async whenRetrievingAuthenticatedUserTimeline() {
      store = createTestStore(
        {
          timelineGateway,
          authGateway,
        },
        testStateBuilderProvider.getState(),
      );
      return store.dispatch(getAuthUserTimeline());
    },
    async whenUserPostsMessage(postMessageParams: PostMessageParams) {
      store = createTestStore(
        { dateProvider, messageGateway },
        testStateBuilderProvider.getState(),
      );
      return store.dispatch(postMessage(postMessageParams));
    },
    thenTheTimelineOfUserShouldBeLoading(user: string) {
      const isUserTimelineLoading = selectIsUserTimelineLoading(
        user,
        store.getState(),
      );
      expect(isUserTimelineLoading).toBe(true);
    },
    thenTheReceivedTimelineShouldBe(expectedTimeline: Timeline) {
      this.thenTimelineShouldBe(expectedTimeline);
    },
    thenMessageShouldHaveBeenPosted(expectedPostedMessage: {
      id: string;
      timelineId: string;
      author: string;
      text: string;
      publishedAt: string;
    }) {
      expect((messageGateway as FakeMessageGateway).lastPostedMessage).toEqual(
        expectedPostedMessage,
      );
    },
    thenTimelineShouldBe(
      expectedTimeline: Timeline & {
        messageNotPosted?: {
          messageId: string;
          error: string;
        };
      },
    ) {
      let expectedState = stateBuilder(testStateBuilderProvider.getState())
        .withTimeline({
          id: expectedTimeline.id,
          user: expectedTimeline.user,
          messages: expectedTimeline.messages.map((m) => m.id),
        })
        .withMessages(expectedTimeline.messages)
        .withNotLoadingTimelineOf({ user: expectedTimeline.user });

      expectedState = expectedTimeline.messageNotPosted
        ? expectedState.withMessageNotPosted(expectedTimeline.messageNotPosted)
        : expectedState.withoutMessageNotPosted(undefined);

      expect(store.getState()).toEqual(expectedState.build());
    },
  };
};

export type TimelinesFixture = ReturnType<typeof createTimelinesFixture>;
