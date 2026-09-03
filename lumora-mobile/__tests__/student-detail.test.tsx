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

const mockUseAuth = jest.fn();
jest.mock('@/lib/auth-context', () => ({
  useAuth: () => mockUseAuth(),
}));

import { apiFetch } from '@/lib/api';

const mockedApiFetch = apiFetch as jest.Mock;

beforeEach(() => {
  mockedApiFetch.mockReset();
  mockUseAuth.mockReturnValue({
    user: { id: 1, name: 'Pat Parent', email: 'pat@example.com', role: 'parent' },
  });
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
    }) // GET tutor-messages
    .mockResolvedValueOnce({
      data: [
        {
          id: 10,
          tier: 'premium',
          provider: 'openai',
          model: 'gpt-4o',
          prompt_key: 'tutor-answer',
          output: 'x'.repeat(250),
          status: 'ok',
          created_at: '2026-01-03T00:00:00Z',
        },
        {
          id: 9,
          tier: 'free',
          provider: 'openai',
          model: null,
          prompt_key: 'lesson-summary',
          output: 'short output',
          status: 'ok',
          created_at: '2026-01-02T12:00:00Z',
        },
      ],
    }); // GET audit-logs (linked Parent, populated — requirement #1)

  await render(<StudentDetailScreen />);

  expect(await screen.findByText('First question')).toBeTruthy();

  const questions = screen.getAllByText(/question$/);
  expect(questions.map((el) => el.props.children)).toEqual(['First question', 'Second question']);

  // Safety-critical: `answer` renders verbatim regardless of outcome.
  expect(screen.getByText(/First answer/)).toBeTruthy();
  expect(screen.getByText(/flagged for review/)).toBeTruthy();

  expect(screen.queryByTestId('tutor-question')).toBeNull();
  expect(screen.queryByTestId('tutor-send')).toBeNull();

  // Audit log section: populated for a linked Parent, output truncated and
  // obviously marked as such, model-null entries render without crashing.
  expect(await screen.findByText(/tutor-answer/)).toBeTruthy();
  expect(screen.getByText(/lesson-summary/)).toBeTruthy();
  expect(screen.getByText(/\[truncated\]/)).toBeTruthy();
  expect(screen.getByText('short output')).toBeTruthy();
});

test('does not crash when the Tutor conversation and audit-log fetches 403 for an unlinked student', async () => {
  const { ApiError } = jest.requireActual('@/lib/api');
  mockedApiFetch
    .mockRejectedValueOnce(new ApiError(403, 'Forbidden')) // GET progress
    .mockRejectedValueOnce(new ApiError(403, 'Forbidden')) // GET attempts
    .mockRejectedValueOnce(new ApiError(403, 'Forbidden')) // GET tutor-messages
    .mockRejectedValueOnce(new ApiError(403, 'Forbidden')); // GET audit-logs

  await render(<StudentDetailScreen />);

  expect(await screen.findByText("Could not load this student's data.")).toBeTruthy();

  // Requirement #2: the error state is the whole page — no audit data leaks.
  expect(screen.queryByText('Audit log')).toBeNull();
});

test('never shows the Audit log section — or fetches it — when a Student views their own screen', async () => {
  mockUseAuth.mockReturnValue({
    user: { id: 5, name: 'Stu Dent', email: 'stu@example.com', role: 'student' },
  });
  mockedApiFetch
    .mockResolvedValueOnce({ data: [] }) // GET progress (self-view allowed)
    .mockResolvedValueOnce({ data: [] }) // GET attempts (self-view allowed)
    .mockResolvedValueOnce({ data: [] }); // GET tutor-messages (self-view allowed)
    // No audit-logs mock queued — a call to it here throws (undefined
    // resolved value), which is exactly the point of this test.

  await render(<StudentDetailScreen />);

  expect(await screen.findByText('No lessons completed yet.')).toBeTruthy();

  expect(screen.queryByText('Audit log')).toBeNull();
  expect(mockedApiFetch).not.toHaveBeenCalledWith(
    expect.stringContaining('/audit-logs'),
  );
});
