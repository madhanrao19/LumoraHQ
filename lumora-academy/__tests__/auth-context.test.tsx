import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "../app/lib/auth-context";

function TestConsumer() {
  const { user, login, logout } = useAuth();
  return (
    <div>
      <p data-testid="user">{user ? `${user.name} (${user.role})` : "none"}</p>
      <button onClick={() => login("parent@example.com", "password")}>
        Log in
      </button>
      <button onClick={() => logout()}>Log out</button>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    window.localStorage.clear();
    global.fetch = jest.fn();
  });

  it("logs in, persists the token, and logs out", async () => {
    const fetchMock = global.fetch as jest.Mock;
    fetchMock.mockResolvedValueOnce({
      status: 200,
      ok: true,
      json: async () => ({
        data: { id: 1, name: "Pat Parent", email: "parent@example.com", role: "parent" },
        token: "test-token",
      }),
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user")).toHaveTextContent("none");

    fireEvent.click(screen.getByText("Log in"));

    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("Pat Parent (parent)"),
    );
    expect(window.localStorage.getItem("lumora_token")).toBe("test-token");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/api/v1/login"),
      expect.objectContaining({ method: "POST" }),
    );

    fetchMock.mockResolvedValueOnce({ status: 204, ok: true, json: async () => null });
    fireEvent.click(screen.getByText("Log out"));

    await waitFor(() =>
      expect(screen.getByTestId("user")).toHaveTextContent("none"),
    );
    expect(window.localStorage.getItem("lumora_token")).toBeNull();
  });
});
