import { Provider } from '@/Provider';
import { createTestStore } from '@/lib/create-store';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { FakeAuthGateway } from '@/lib/auth/infra/fake-auth.gateway';
import { createRouter } from '@/router';
import { RouteObject, createMemoryRouter } from 'react-router-dom';

const createMemoryRouterWithCurrentRoute =
  (currentRoute: string) => (routes: RouteObject[]) =>
    createMemoryRouter(routes, { initialEntries: [currentRoute] });

describe('Login', () => {
  test('Should redirect to login when not authenticated', async () => {
    const store = createTestStore();
    const router = createRouter(
      { store },
      createMemoryRouterWithCurrentRoute('/'),
    );
    render(<Provider store={store} router={router} />);

    expect(await screen.findByText('Continue with Google')).toBeInTheDocument();
  });

  test('Should redirect to home page when authentication has succeeded', async () => {
    const authGateway = new FakeAuthGateway();
    authGateway.willSucceedForGoogleAuthForUser = 'Alice';
    const store = createTestStore({
      authGateway,
    });
    const user = userEvent.setup();
    const router = createRouter({ store });
    render(<Provider store={store} router={router} />);
    const loginWithGoogle = await screen.findByText('Continue with Google');

    await user.click(loginWithGoogle);

    expect(await screen.findByText('For you')).toBeInTheDocument();
  });
});
