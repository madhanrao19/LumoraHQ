import { fireEvent, render, screen } from '@testing-library/react-native';

import AssessmentScreen from '@/app/(portal)/assessments/[assessmentId]';

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ assessmentId: '1' }),
  Link: ({ children, ...props }: any) =>
    require('react').createElement(require('react-native').Text, props, children),
}));

const mockUseAuth = jest.fn();
jest.mock('@/lib/auth-context', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock apiFetch AND apiFetchCached independently, both as their own
// jest.fn()s — not via `{...jest.requireActual, apiFetch: jest.fn()}`.
// apiFetchCached's real implementation calls apiFetch via a same-module
// reference that a partial mock override can't intercept (a classic CJS
// self-reference gotcha), so a "real" apiFetchCached would silently hit
// the real, unreachable network in this test environment.
jest.mock('@/lib/api', () => ({
  apiFetch: jest.fn(),
  apiFetchCached: jest.fn(),
  ApiError: jest.requireActual('@/lib/api').ApiError,
}));

import { apiFetch, apiFetchCached } from '@/lib/api';

const mockedApiFetch = apiFetch as jest.Mock;
const mockedApiFetchCached = apiFetchCached as jest.Mock;

const assessment = {
  id: 1,
  topic_id: 5,
  title: 'Fractions Quiz',
  published_at: '2026-01-01T00:00:00Z',
  questions: [
    { id: 10, type: 'multiple_choice', prompt: '2 + 2?', options: { A: '3', B: '4' } },
    { id: 11, type: 'short_answer', prompt: 'Capital of France?', options: null },
  ],
};

beforeEach(() => {
  mockedApiFetch.mockReset();
  mockedApiFetchCached.mockReset();
  mockedApiFetchCached.mockResolvedValue({ data: { data: assessment }, stale: false });
  mockUseAuth.mockReturnValue({
    user: { id: 1, name: 'Stu Dent', email: 'stu@example.com', role: 'student' },
  });
});

test('renders questions, submits responses, and shows the score', async () => {
  mockedApiFetch
    .mockResolvedValueOnce({ data: [] }) // GET attempts (initial)
    .mockResolvedValueOnce({
      data: { id: 99, assessment_id: 1, responses: { 10: 'B', 11: 'Paris' }, score: 100, completed_at: '2026-01-02T00:00:00Z' },
    }) // POST attempt
    .mockResolvedValueOnce({
      data: [{ id: 99, assessment_id: 1, responses: { 10: 'B', 11: 'Paris' }, score: 100, completed_at: '2026-01-02T00:00:00Z' }],
    }); // GET attempts (refetch)

  await render(<AssessmentScreen />);

  expect(await screen.findByText('Fractions Quiz')).toBeTruthy();
  expect(mockedApiFetchCached).toHaveBeenCalledWith('/api/v1/assessments/1', 'assessment-1');

  await fireEvent.press(screen.getByText('4'));
  await fireEvent.changeText(screen.getByDisplayValue(''), 'Paris');
  await fireEvent.press(screen.getByText('Submit'));

  expect(await screen.findByText('Score: 100%')).toBeTruthy();
  expect(mockedApiFetch).toHaveBeenCalledWith('/api/v1/assessments/1/attempts', {
    method: 'POST',
    body: { responses: { 10: 'B', 11: 'Paris' } },
  });
});

test('shows a server validation error instead of a score', async () => {
  const { ApiError } = jest.requireActual('@/lib/api');
  mockedApiFetch
    .mockResolvedValueOnce({ data: [] }) // GET attempts
    .mockRejectedValueOnce(new ApiError(422, 'The responses field is required.')); // POST attempt fails

  await render(<AssessmentScreen />);

  expect(await screen.findByText('Fractions Quiz')).toBeTruthy();

  await fireEvent.press(screen.getByText('Submit'));

  expect(await screen.findByText('The responses field is required.')).toBeTruthy();
  expect(screen.queryByText(/Score:/)).toBeNull();
});

test('shows an offline banner when the assessment is served from cache', async () => {
  mockedApiFetchCached.mockReset();
  mockedApiFetchCached.mockResolvedValue({ data: { data: assessment }, stale: true });
  mockedApiFetch.mockResolvedValueOnce({ data: [] }); // GET attempts

  await render(<AssessmentScreen />);

  expect(await screen.findByText('Fractions Quiz')).toBeTruthy();
  expect(screen.getByText(/offline/i)).toBeTruthy();
});
