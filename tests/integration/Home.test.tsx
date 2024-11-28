import { expect, test } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "@/app/page";

async function resolvedComponent(Component: Function, props: any) {
  const ComponentResolved = await Component(props);
  return () => ComponentResolved;
}

test("Deve renderizar a pagina inicial", async () => {
  const Component = await resolvedComponent(Home, screen);
  render(<Component />);
  expect(screen.getByRole("heading", { level: 1, name: "Home" })).toBeDefined();
  expect(screen.findAllByText("Teste")).toBeDefined();
});
