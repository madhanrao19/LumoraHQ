import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TutorPage from "../app/[lang]/(portal)/tutor/page";

jest.mock("next/navigation", () => ({
  useParams: () => ({ lang: "en" }),
}));

const mockUseAuth = jest.fn();
jest.mock("../app/lib/auth-context", () => ({
  useAuth: () => mockUseAuth(),
}));

function jsonResponse(status: number, body: unknown) {
  return { status, ok: status >= 200 && status < 300, json: async () => body };
}

describe("TutorPage", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    mockUseAuth.mockReturnValue({
      user: { id: 7, name: "Stu Dent", email: "stu@example.com", role: "student" },
    });
  });

  it("loads history in chronological order and appends a sent turn", async () => {
    const fetchMock = global.fetch as jest.Mock;
    // Backend returns newest-first (->latest()) — page must reverse to chronological.
    fetchMock
      .mockResolvedValueOnce(
        jsonResponse(200, {
          data: [
            { id: 2, question: "Second question", answer: "Second answer", outcome: "pass", created_at: "2026-01-02T00:00:00Z" },
            { id: 1, question: "First question", answer: "First answer", outcome: "pass", created_at: "2026-01-01T00:00:00Z" },
          ],
        }),
      ) // GET tutor-messages
      .mockResolvedValueOnce(
        jsonResponse(200, {
          data: { id: 3, question: "Third question", answer: "Third answer", outcome: "pass", created_at: "2026-01-03T00:00:00Z" },
        }),
      ); // POST ask

    render(<TutorPage />);

    await waitFor(() => expect(screen.getByText("First question")).toBeInTheDocument());

    const questions = screen.getAllByText(/question$/);
    expect(questions.map((el) => el.textContent)).toEqual([
      "First question",
      "Second question",
    ]);

    fireEvent.change(screen.getByLabelText("Ask the Tutor"), {
      target: { value: "Third question" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => expect(screen.getByText("Third answer")).toBeInTheDocument());

    const postCall = fetchMock.mock.calls[1];
    expect(postCall[0]).toContain("/api/v1/tutor/ask");
    expect(JSON.parse(postCall[1].body)).toEqual({ question: "Third question" });
  });

  // Safety-critical assertion: `message.answer` is what the backend decided
  // is safe to show, for every outcome — the UI must render it verbatim and
  // never branch on `outcome` to alter it, even for block/escalate.
  it.each(["pass", "redirect", "block", "escalate"] as const)(
    "renders message.answer verbatim for outcome=%s",
    async (outcome) => {
      const fetchMock = global.fetch as jest.Mock;
      fetchMock.mockResolvedValueOnce(
        jsonResponse(200, {
          data: [
            {
              id: 1,
              question: "A question",
              answer: `Safe answer for ${outcome}`,
              outcome,
              created_at: "2026-01-01T00:00:00Z",
            },
          ],
        }),
      );

      render(<TutorPage />);

      await waitFor(() =>
        expect(
          screen.getByText(new RegExp(`Safe answer for ${outcome}`)),
        ).toBeInTheDocument(),
      );
    },
  );

  it("shows a load error", async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce(jsonResponse(500, { message: "Server error" }));

    render(<TutorPage />);

    await waitFor(() =>
      expect(screen.getByText("Could not load your Tutor conversation.")).toBeInTheDocument(),
    );
  });

  it("shows the role-gated message for a non-student", () => {
    mockUseAuth.mockReturnValue({
      user: { id: 8, name: "Pa Rent", email: "parent@example.com", role: "parent" },
    });

    render(<TutorPage />);

    expect(
      screen.getByText("Only Student accounts can use the Tutor."),
    ).toBeInTheDocument();
  });
});
