import { render, screen, waitFor } from '@testing-library/react-native';

import StudentDetailScreen from '@/app/(portal)/students/[studentId]';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ studentId: '5' }),
  Link: ({ children, ...props }: any) =>
    require('react').createElement(require('react-native').Text, props, children),
}));

jest.mock('@/lib/api', () => ({
  ...jest.requireActual('@/lib/api'),
  apiFetch: jest.fn(),
}));

import { apiFetch } from '@/lib/api';

const mockedApiFetch = apiFetch as jest.Mock;

beforeEach(() => {
  mockedApiFetch.mockReset();
});

test("renders the student's Tutor history in chronological order, read-only (no input)", async () => {
  mockedApiFetch
    .mockResolvedValueOnce({ data: [] }) // GET progress
    .mockResolvedValueOnce({ data: [] }) // GET attempts
    .mockResolvedValueOnce({
      data: [
        { id: 2, question: 'Second question', answer: 'Second answer', outcome: 'pass', created_at: '2026-01-02T00:00:00Z' },
        { id: 1, question: 'First question', answer: 'First answer', outcome: 'escalate', created_at: '2026-01-01T00:00:00Z' },
      ],
    }); // GET tutor-messages

  await render(<StudentDetailScreen />);

  expect(await screen.findByText('First question')).toBeTruthy();

  const questions = screen.getAllByText(/question$/);
  expect(questions.map((el) => el.props.children)).toEqual(['First question', 'Second question']);

  // Safety-critical: `answer` renders verbatim regardless of outcome.
  expect(screen.getByText(/First answer/)).toBeTruthy();
  expect(screen.getByText(/flagged for review/)).toBeTruthy();

  expect(screen.queryByTestId('tutor-question')).toBeNull();
  expect(screen.queryByTestId('tutor-send')).toBeNull();
});

test('does not crash when the Tutor conversation fetch 403s for an unlinked student', async () => {
  const { ApiError } = jest.requireActual('@/lib/api');
  mockedApiFetch
    .mockRejectedValueOnce(new ApiError(403, 'Forbidden')) // GET progress
    .mockRejectedValueOnce(new ApiError(403, 'Forbidden')); // GET attempts
  mockedApiFetch.mockRejectedValueOnce(new ApiError(403, 'Forbidden')); // GET tutor-messages

  await render(<StudentDetailScreen />);

  expect(await screen.findByText("Could not load this student's data.")).toBeTruthy();
});
