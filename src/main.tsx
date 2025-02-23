import { FakeMessageGateway } from '@/lib/timelines/infra/fake-message.gateway.ts';
import { RealDateProvider } from '@/lib/timelines/infra/real-date-provider.ts';
import { FakeDataUserGateway } from '@/lib/users/infra/fake-data-user.gateway.ts';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from './Provider.tsx';
import { FakeAuthGateway } from './lib/auth/infra/fake-auth.gateway.ts';
import { FakeStorageAuthGateway } from './lib/auth/infra/fake-storage-auth.gateway.ts';
import { createStore } from './lib/create-store.ts';
import { users } from './lib/fake-data.ts';
import { FakeDataTimelineGateway } from './lib/timelines/infra/fake-data-timeline.gateway.ts';
import { createRouter } from './router.tsx';

const fakeAuthGateway = new FakeAuthGateway(500);
fakeAuthGateway.willSucceedForGoogleAuthForUser = [...users.values()][0];
fakeAuthGateway.willSucceedForGithubAuthForUser = [...users.values()][1];
const authGateway = new FakeStorageAuthGateway(fakeAuthGateway);
const messageGateway = new FakeMessageGateway();
const timelineGateway = new FakeDataTimelineGateway();
const dateProvider = new RealDateProvider();
const userGateway = new FakeDataUserGateway();
const store = createStore({
  authGateway,
  timelineGateway,
  messageGateway,
  dateProvider,
  userGateway,
});

const router = createRouter({ store });

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store} router={router} />
  </React.StrictMode>,
);
