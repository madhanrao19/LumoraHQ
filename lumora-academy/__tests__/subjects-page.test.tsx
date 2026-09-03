import { render, screen, waitFor } from "@testing-library/react";
import SubjectsPage from "../app/[lang]/(portal)/subjects/page";

jest.mock("next/navigation", () => ({
  useParams: () => ({ lang: "en" }),
}));

describe("SubjectsPage", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => ({
        data: [
          { id: 1, name: "Mathematics", slug: "mathematics", order: 1 },
          { id: 2, name: "Science", slug: "science", order: 2 },
        ],
      }),
    });
  });

  it("fetches and renders the subject list", async () => {
    render(<SubjectsPage />);

    expect(screen.getByText("Loading subjects…")).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText("Mathematics")).toBeInTheDocument());
    expect(screen.getByText("Science")).toBeInTheDocument();

    const mathLink = screen.getByText("Mathematics").closest("a");
    expect(mathLink).toHaveAttribute("href", "/en/subjects/1");
  });
});
