import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import LoginScreen from '@/app/login';
import { AuthProvider } from '@/lib/auth-context';

// expo-router needs a real navigator tree for Link/useRouter — mock the
// pieces this screen touches, same as the web test's isolated-render style.
// Jest mock factories may only reference `mock`-prefixed vars, hence the name.
const mockReplace = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({ replace: mockReplace }),
  Link: ({ children, ...props }: any) =>
    require('react').createElement(require('react-native').Text, props, children),
}));

jest.mock('@/lib/api', () => {
  const actual = jest.requireActual('@/lib/api');
  return {
    ...actual,
    getToken: jest.fn().mockResolvedValue(null),
    setToken: jest.fn(),
    clearToken: jest.fn(),
    apiFetch: jest.fn(),
  };
});

import { apiFetch } from '@/lib/api';

const mockedApiFetch = apiFetch as jest.Mock;

beforeEach(() => {
  mockReplace.mockClear();
  mockedApiFetch.mockReset();
});

test('logs in and navigates on success', async () => {
  mockedApiFetch.mockResolvedValueOnce({
    data: { id: 1, name: 'Ada', email: 'ada@example.com', role: 'student' },
    token: 'tok_123',
  });

  await render(
    <AuthProvider>
      <LoginScreen />
    </AuthProvider>,
  );

  await fireEvent.changeText(screen.getByTestId('email'), 'ada@example.com');
  await fireEvent.changeText(screen.getByTestId('password'), 'password');
  await fireEvent.press(screen.getByTestId('submit'));

  await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/'));
  expect(mockedApiFetch).toHaveBeenCalledWith(
    '/api/v1/login',
    expect.objectContaining({ method: 'POST', body: { email: 'ada@example.com', password: 'password' } }),
  );
});

test('shows 422 field errors on failure', async () => {
  const { ApiError } = jest.requireActual('@/lib/api');
  mockedApiFetch.mockRejectedValueOnce(new ApiError(422, 'Validation failed', { email: ['Invalid email'] }));

  await render(
    <AuthProvider>
      <LoginScreen />
    </AuthProvider>,
  );

  await fireEvent.changeText(screen.getByTestId('email'), 'bad');
  await fireEvent.changeText(screen.getByTestId('password'), 'password');
  await fireEvent.press(screen.getByTestId('submit'));

  expect(await screen.findByText('Invalid email')).toBeTruthy();
  expect(mockReplace).not.toHaveBeenCalled();
});
