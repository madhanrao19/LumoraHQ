import { render, screen, waitFor } from "@testing-library/react";
import StudentDetailPage from "../app/[lang]/(portal)/students/[studentId]/page";

jest.mock("next/navigation", () => ({
  useParams: () => ({ lang: "en", studentId: "5" }),
}));

const mockUseAuth = jest.fn();
jest.mock("../app/lib/auth-context", () => ({
  useAuth: () => mockUseAuth(),
}));

function jsonResponse(status: number, body: unknown) {
  return { status, ok: status >= 200 && status < 300, json: async () => body };
}

describe("StudentDetailPage — Tutor conversation (read-only, Parent view)", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    mockUseAuth.mockReturnValue({
      user: { id: 1, name: "Pat Parent", email: "pat@example.com", role: "parent" },
    });
  });

  it("renders the student's Tutor history in chronological order with no input box", async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock
      .mockResolvedValueOnce(jsonResponse(200, { data: [] })) // GET progress
      .mockResolvedValueOnce(jsonResponse(200, { data: [] })) // GET attempts
      .mockResolvedValueOnce(
        jsonResponse(200, {
          data: [
            { id: 2, question: "Second question", answer: "Second answer", outcome: "pass", created_at: "2026-01-02T00:00:00Z" },
            { id: 1, question: "First question", answer: "First answer", outcome: "escalate", created_at: "2026-01-01T00:00:00Z" },
          ],
        }),
      ) // GET tutor-messages
      .mockResolvedValueOnce(
        jsonResponse(200, {
          data: [
            {
              id: 10,
              tier: "premium",
              provider: "openai",
              model: "gpt-4o",
              prompt_key: "tutor-answer",
              output: "x".repeat(250),
              status: "ok",
              created_at: "2026-01-03T00:00:00Z",
            },
            {
              id: 9,
              tier: "free",
              provider: "openai",
              model: null,
              prompt_key: "lesson-summary",
              output: "short output",
              status: "ok",
              created_at: "2026-01-02T12:00:00Z",
            },
          ],
        }),
      ); // GET audit-logs (linked Parent, populated — requirement #1)

    render(<StudentDetailPage />);

    await waitFor(() => expect(screen.getByText("First question")).toBeInTheDocument());

    const questions = screen.getAllByText(/question$/);
    expect(questions.map((el) => el.textContent)).toEqual([
      "First question",
      "Second question",
    ]);

    // Safety-critical: `answer` renders verbatim regardless of outcome.
    expect(screen.getByText(/First answer/)).toBeInTheDocument();
    expect(screen.getByText(/flagged for review/)).toBeInTheDocument();

    expect(screen.queryByLabelText("Ask the Tutor")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Send" })).not.toBeInTheDocument();

    // Audit log section: populated for a linked Parent, output truncated and
    // obviously marked as such, model-null entries render without crashing.
    await waitFor(() => expect(screen.getByText(/tutor-answer/)).toBeInTheDocument());
    expect(screen.getByText(/lesson-summary/)).toBeInTheDocument();
    expect(screen.getByText(/\[truncated\]/)).toBeInTheDocument();
    expect(screen.getByText("short output")).toBeInTheDocument();
  });

  it("does not crash when the Tutor conversation and audit-log fetches 403 for an unlinked student", async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock
      .mockResolvedValueOnce(jsonResponse(403, { message: "Forbidden" })) // GET progress
      .mockResolvedValueOnce(jsonResponse(403, { message: "Forbidden" })) // GET attempts
      .mockResolvedValueOnce(jsonResponse(403, { message: "Forbidden" })) // GET tutor-messages
      .mockResolvedValueOnce(jsonResponse(403, { message: "Forbidden" })); // GET audit-logs

    render(<StudentDetailPage />);

    await waitFor(() =>
      expect(screen.getByText("Could not load this student's data.")).toBeInTheDocument(),
    );

    // Requirement #2: the error state is the whole page — no audit data leaks.
    expect(screen.queryByText("Audit log")).not.toBeInTheDocument();
  });

  it("never shows the Audit log section — or fetches it — when a Student views their own page", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 5, name: "Stu Dent", email: "stu@example.com", role: "student" },
    });
    const fetchMock = global.fetch as jest.Mock;
    fetchMock
      .mockResolvedValueOnce(jsonResponse(200, { data: [] })) // GET progress (self-view allowed)
      .mockResolvedValueOnce(jsonResponse(200, { data: [] })) // GET attempts (self-view allowed)
      .mockResolvedValueOnce(jsonResponse(200, { data: [] })); // GET tutor-messages (self-view allowed)
      // No audit-logs mock queued — a fetch to it here would exhaust the
      // mock queue and throw, which is exactly the point of this test.

    render(<StudentDetailPage />);

    await waitFor(() =>
      expect(screen.getByText("No lessons completed yet.")).toBeInTheDocument(),
    );

    expect(screen.queryByText("Audit log")).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalledWith(
      expect.stringContaining("/audit-logs"),
      expect.anything(),
    );
  });
});
