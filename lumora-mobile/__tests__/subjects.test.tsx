import { render, screen } from '@testing-library/react-native';

import SubjectsScreen from '@/app/(portal)/subjects/index';

jest.mock('expo-router', () => ({
  Link: ({ children, ...props }: any) =>
    require('react').createElement(require('react-native').Text, props, children),
}));

jest.mock('@/lib/api', () => ({
  apiFetch: jest.fn(),
}));

import { apiFetch } from '@/lib/api';

const mockedApiFetch = apiFetch as jest.Mock;

beforeEach(() => {
  mockedApiFetch.mockReset();
});

test('renders fetched subjects', async () => {
  mockedApiFetch.mockResolvedValueOnce({
    data: [
      { id: 1, name: 'Mathematics', slug: 'maths', order: 1 },
      { id: 2, name: 'Science', slug: 'science', order: 2 },
    ],
  });

  await render(<SubjectsScreen />);

  expect(await screen.findByText('Mathematics')).toBeTruthy();
  expect(screen.getByText('Science')).toBeTruthy();
  expect(mockedApiFetch).toHaveBeenCalledWith('/api/v1/subjects', { auth: false });
});

test('shows an error message when the fetch fails', async () => {
  mockedApiFetch.mockRejectedValueOnce(new Error('network down'));

  await render(<SubjectsScreen />);

  expect(await screen.findByText('Could not load subjects.')).toBeTruthy();
});
