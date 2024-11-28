import { expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

test("Deve renderizar a pagina inicial", async () => {
  render(<Home />);
  expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeDefined();
});
