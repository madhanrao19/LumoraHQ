import { render, screen } from "@testing-library/react";
import Home from "../app/[lang]/page";

describe("Home", () => {
  it("renders a heading", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Lumora Academy" }),
    ).toBeInTheDocument();
  });
});
