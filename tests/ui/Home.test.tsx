import Home from "@/app/page";
import { resolveServerSideComponent } from "@/tests/helpers/resolved-component";
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";

test("Deve renderizar a pagina inicial", async () => {
  const Component = await resolveServerSideComponent(Home, {});
  render(<Component />);
  expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeDefined();
});
