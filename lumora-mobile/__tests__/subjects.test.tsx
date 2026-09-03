import { render, screen } from '@testing-library/react-native';

import SubjectsScreen from '@/app/(portal)/subjects/index';

jest.mock('expo-router', () => ({
  Link: ({ children, ...props }: any) =>
    require('react').createElement(require('react-native').Text, props, children),
}));

jest.mock('@/lib/api', () => ({
  apiFetchCached: jest.fn(),
}));

import { apiFetchCached } from '@/lib/api';

const mockedApiFetchCached = apiFetchCached as jest.Mock;

beforeEach(() => {
  mockedApiFetchCached.mockReset();
});

test('renders fetched subjects', async () => {
  mockedApiFetchCached.mockResolvedValueOnce({
    data: {
      data: [
        { id: 1, name: 'Mathematics', slug: 'maths', order: 1 },
        { id: 2, name: 'Science', slug: 'science', order: 2 },
      ],
    },
    stale: false,
  });

  await render(<SubjectsScreen />);

  expect(await screen.findByText('Mathematics')).toBeTruthy();
  expect(screen.getByText('Science')).toBeTruthy();
  expect(mockedApiFetchCached).toHaveBeenCalledWith('/api/v1/subjects', 'subjects');
  expect(screen.queryByText(/offline/i)).toBeNull();
});

test('shows an error message when the fetch fails and no cache exists', async () => {
  mockedApiFetchCached.mockRejectedValueOnce(new Error('network down'));

  await render(<SubjectsScreen />);

  expect(await screen.findByText('Could not load subjects.')).toBeTruthy();
});

test('shows an offline banner when serving cached (stale) subjects', async () => {
  mockedApiFetchCached.mockResolvedValueOnce({
    data: { data: [{ id: 1, name: 'Mathematics', slug: 'maths', order: 1 }] },
    stale: true,
  });

  await render(<SubjectsScreen />);

  expect(await screen.findByText('Mathematics')).toBeTruthy();
  expect(screen.getByText(/offline/i)).toBeTruthy();
});
