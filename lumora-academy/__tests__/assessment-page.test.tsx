import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AssessmentPage from "../app/[lang]/(portal)/assessments/[assessmentId]/page";

jest.mock("next/navigation", () => ({
  useParams: () => ({ lang: "en", assessmentId: "1" }),
}));

const mockUseAuth = jest.fn();
jest.mock("../app/lib/auth-context", () => ({
  useAuth: () => mockUseAuth(),
}));

const assessment = {
  id: 1,
  topic_id: 5,
  title: "Fractions Quiz",
  published_at: "2026-01-01T00:00:00Z",
  questions: [
    { id: 10, type: "multiple_choice", prompt: "2 + 2?", options: { A: "3", B: "4" } },
    { id: 11, type: "short_answer", prompt: "Capital of France?", options: null },
  ],
};

function jsonResponse(status: number, body: unknown) {
  return { status, ok: status >= 200 && status < 300, json: async () => body };
}

describe("AssessmentPage", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    mockUseAuth.mockReturnValue({
      user: { id: 1, name: "Stu Dent", email: "stu@example.com", role: "student" },
    });
  });

  it("renders questions, submits responses, and shows the score", async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock
      .mockResolvedValueOnce(jsonResponse(200, { data: assessment })) // GET assessment
      .mockResolvedValueOnce(jsonResponse(200, { data: [] })) // GET attempts (initial)
      .mockResolvedValueOnce(
        jsonResponse(200, {
          data: {
            id: 99,
            assessment_id: 1,
            responses: { 10: "B", 11: "Paris" },
            score: 100,
            completed_at: "2026-01-02T00:00:00Z",
          },
        }),
      ) // POST attempt
      .mockResolvedValueOnce(
        jsonResponse(200, {
          data: [
            {
              id: 99,
              assessment_id: 1,
              responses: { 10: "B", 11: "Paris" },
              score: 100,
              completed_at: "2026-01-02T00:00:00Z",
            },
          ],
        }),
      ); // GET attempts (refetch after submit)

    render(<AssessmentPage />);

    await waitFor(() =>
      expect(screen.getByText("Fractions Quiz")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByLabelText("4"));
    fireEvent.change(screen.getByLabelText("Capital of France?"), {
      target: { value: "Paris" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() =>
      expect(screen.getByText("Score: 100%")).toBeInTheDocument(),
    );

    const postCall = fetchMock.mock.calls[2];
    expect(postCall[0]).toContain("/api/v1/assessments/1/attempts");
    expect(JSON.parse(postCall[1].body)).toEqual({
      responses: { 10: "B", 11: "Paris" },
    });
  });

  it("shows a server validation error instead of a score", async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock
      .mockResolvedValueOnce(jsonResponse(200, { data: assessment })) // GET assessment
      .mockResolvedValueOnce(jsonResponse(200, { data: [] })) // GET attempts
      .mockResolvedValueOnce(
        jsonResponse(422, { message: "The responses field is required." }),
      ); // POST attempt fails

    render(<AssessmentPage />);

    await waitFor(() =>
      expect(screen.getByText("Fractions Quiz")).toBeInTheDocument(),
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() =>
      expect(
        screen.getByText("The responses field is required."),
      ).toBeInTheDocument(),
    );
    expect(screen.queryByText(/Score:/)).not.toBeInTheDocument();
  });
});
