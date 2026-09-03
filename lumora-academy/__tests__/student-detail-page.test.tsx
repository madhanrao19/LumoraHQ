import { render, screen, waitFor } from "@testing-library/react";
import StudentDetailPage from "../app/[lang]/(portal)/students/[studentId]/page";

jest.mock("next/navigation", () => ({
  useParams: () => ({ lang: "en", studentId: "5" }),
}));

function jsonResponse(status: number, body: unknown) {
  return { status, ok: status >= 200 && status < 300, json: async () => body };
}

describe("StudentDetailPage — Tutor conversation (read-only, Parent view)", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
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
      ); // GET tutor-messages

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
  });

  it("does not crash when the Tutor conversation fetch 403s for an unlinked student", async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock
      .mockResolvedValueOnce(jsonResponse(403, { message: "Forbidden" })) // GET progress
      .mockResolvedValueOnce(jsonResponse(403, { message: "Forbidden" })) // GET attempts
      .mockResolvedValueOnce(jsonResponse(403, { message: "Forbidden" })); // GET tutor-messages

    render(<StudentDetailPage />);

    await waitFor(() =>
      expect(screen.getByText("Could not load this student's data.")).toBeInTheDocument(),
    );
  });
});
