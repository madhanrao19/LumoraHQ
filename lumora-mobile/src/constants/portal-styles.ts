// Shared styles for the auth/portal screens — a direct translation of the
// zinc-palette Tailwind utility classes lumora-academy's portal pages use,
// reused as-is instead of redefined per screen.
import { StyleSheet } from "react-native";
import { Red, White, Zinc } from "./colors";

export const portalStyles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  heading: { fontSize: 20, fontWeight: "600" },
  subheading: { fontSize: 17, fontWeight: "600" },
  muted: { color: Zinc[500] },
  error: { color: Red[600], padding: 16 },
  back: { fontSize: 14, textDecorationLine: "underline" },
  card: {
    borderWidth: 1,
    borderColor: Zinc[200],
    borderRadius: 6,
    padding: 12,
  },
  button: {
    backgroundColor: Zinc[900],
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: White, fontWeight: "600" },
  link: { textDecorationLine: "underline" },
});
