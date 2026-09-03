import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import TutorScreen from '@/app/(portal)/tutor/index';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({}),
  Link: ({ children, ...props }: any) =>
    require('react').createElement(require('react-native').Text, props, children),
}));

const mockUseAuth = jest.fn();
jest.mock('@/lib/auth-context', () => ({
  useAuth: () => mockUseAuth(),
}));

jest.mock('@/lib/api', () => ({
  ...jest.requireActual('@/lib/api'),
  apiFetch: jest.fn(),
}));

import { apiFetch } from '@/lib/api';

const mockedApiFetch = apiFetch as jest.Mock;

beforeEach(() => {
  mockedApiFetch.mockReset();
  mockUseAuth.mockReturnValue({
    user: { id: 7, name: 'Stu Dent', email: 'stu@example.com', role: 'student' },
  });
});

test('loads history in chronological order and appends a sent turn', async () => {
  mockedApiFetch
    .mockResolvedValueOnce({
      // Backend returns newest-first (->latest()) — screen must reverse to chronological.
      data: [
        { id: 2, question: 'Second question', answer: 'Second answer', outcome: 'pass', created_at: '2026-01-02T00:00:00Z' },
        { id: 1, question: 'First question', answer: 'First answer', outcome: 'pass', created_at: '2026-01-01T00:00:00Z' },
      ],
    }) // GET tutor-messages
    .mockResolvedValueOnce({
      data: { id: 3, question: 'Third question', answer: 'Third answer', outcome: 'pass', created_at: '2026-01-03T00:00:00Z' },
    }); // POST ask

  await render(<TutorScreen />);

  expect(await screen.findByText('First question')).toBeTruthy();

  const questions = screen.getAllByText(/^(First|Second) question$/);
  expect(questions.map((el) => el.props.children)).toEqual(['First question', 'Second question']);

  await fireEvent.changeText(screen.getByTestId('tutor-question'), 'Third question');
  await fireEvent.press(screen.getByTestId('tutor-send'));

  expect(await screen.findByText('Third answer')).toBeTruthy();
  expect(mockedApiFetch).toHaveBeenCalledWith('/api/v1/tutor/ask', {
    method: 'POST',
    body: { question: 'Third question' },
  });
});

// Safety-critical assertion: `message.answer` is what the backend decided is
// safe to show, for every outcome — the screen must render it verbatim and
// never branch on `outcome` to alter it, even for block/escalate.
test.each(['pass', 'redirect', 'block', 'escalate'] as const)(
  'renders message.answer verbatim for outcome=%s',
  async (outcome) => {
    mockedApiFetch.mockResolvedValueOnce({
      data: [
        { id: 1, question: 'A question', answer: `Safe answer for ${outcome}`, outcome, created_at: '2026-01-01T00:00:00Z' },
      ],
    });

    await render(<TutorScreen />);

    expect(await screen.findByText(new RegExp(`Safe answer for ${outcome}`))).toBeTruthy();
  },
);

test('shows a load error', async () => {
  const { ApiError } = jest.requireActual('@/lib/api');
  mockedApiFetch.mockRejectedValueOnce(new ApiError(500, 'Server error'));

  await render(<TutorScreen />);

  expect(await screen.findByText('Could not load your Tutor conversation.')).toBeTruthy();
});

test('shows the role-gated message for a non-student', async () => {
  mockUseAuth.mockReturnValue({
    user: { id: 8, name: 'Pa Rent', email: 'parent@example.com', role: 'parent' },
  });

  await render(<TutorScreen />);

  expect(screen.getByText('Only Student accounts can use the Tutor.')).toBeTruthy();
});
