import {
  randNumber,
  randParagraph,
  randRecentDate,
  randTodo,
  randUserName,
  seed,
} from '@ngneat/falso';

seed('42');

const randomId = () => randTodo().id.split('-')[0];

const generateRandomIds = (x: number) => new Array(x).fill(x).map(randomId);

export const randomPickFromMap = <T>(theMap: Map<string, T>) =>
  theMap.get(
    [...theMap.keys()][randNumber({ min: 0, max: theMap.size - 1 })],
  ) as T;

export const users = new Map(
  generateRandomIds(500).map((userId) => {
    return [
      userId,
      {
        id: userId,
        username: randUserName(),
        profilePicture: `https://picsum.photos/200/200?random=${userId}`,
      },
    ];
  }),
);

export const messages = new Map(
  generateRandomIds(1000).map((msgId) => [
    msgId,
    {
      id: msgId,
      text: randParagraph({ length: randNumber({ min: 1, max: 10 }) }).join(
        '\n',
      ),
      publishedAt: randRecentDate(),
      authorId: randomPickFromMap(users),
    },
  ]),
);

const userLikesByMessage = new Map<string, string[]>();

export const likesByMessage = new Map(
  [...messages.values()].map((msg) => {
    const usersCopy = new Map(users);
    return [
      msg.id,
      generateRandomIds(randNumber({ min: 0, max: 150 })).map((likeId) => {
        const user = randomPickFromMap(usersCopy);
        usersCopy.delete(user.id);
        userLikesByMessage.set(
          msg.id,
          (userLikesByMessage.get(msg.id) ?? []).concat(user.id),
        );

        return {
          id: likeId,
          userId: user.id,
          messageId: msg.id,
        };
      }),
    ];
  }),
);

export const messagesByTimeline = new Map<string, string[]>();

export const timelinesByUser = new Map(
  [...users.values()].map((user) => {
    const timelineId = randomId();
    const messagesCopy = new Map(messages);
    const messageIds: string[] = (() =>
      new Array(10).fill(null).map(() => {
        const messageId = randomPickFromMap(messagesCopy).id;
        messagesCopy.delete(messageId);
        messagesByTimeline.set(
          timelineId,
          (messagesByTimeline.get(timelineId) ?? []).concat(messageId),
        );
        return messageId;
      }))();

    messageIds.sort((mIdA, mIdB) => {
      const [mA, mB] = [messages.get(mIdA), messages.get(mIdB)];
      if (!mA || !mB) return 0;

      return mB.publishedAt.getTime() - mA.publishedAt.getTime();
    });
    return [
      user.id,
      {
        id: timelineId,
        user: user.id,
        messages: messageIds,
      },
    ];
  }),
);

export const followersByUser = new Map(
  [...users.values()].map((u) => {
    const usersCopy = new Map(users);
    usersCopy.delete(u.id);
    return [
      u.id,
      new Array(randNumber({ min: 0, max: usersCopy.size }))
        .fill(null)
        .map(() => {
          const user = randomPickFromMap(usersCopy);
          usersCopy.delete(user.id);
          return user.id;
        }),
    ];
  }),
);

export const followingByUser = new Map<string, string[]>();

for (const [userId, followers] of followersByUser) {
  followers.forEach((followerId) => {
    const existingFollowing = followingByUser.get(followerId) ?? [];
    followingByUser.set(followerId, existingFollowing.concat(userId));
  });
}

// export const isAuthUserFollowsUser = (userId: string) =>
//   (followingByUser.get(fakeAuthUser.id) ?? []).includes(userId);
