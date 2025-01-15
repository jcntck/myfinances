import { DatePickerWithRange } from "@/components/shared/date-picker-with-range";
import Debit from "@/app/transacao/debito/page";
import { TransactionsDataTable } from "@/components/transactions/data-table";
import { resolveServerSideComponent } from "@/tests/helpers/resolved-component";
import { render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";

vi.mock("@/components/shared/date-picker-with-range");
vi.mock("@/components/transactions/data-table");

test("Deve renderizar a lista de transações de debito", async () => {
  const Component = await resolveServerSideComponent(Debit, {});
  render(<Component />);
  expect(screen.getByRole("main")).toBeDefined();
  const title = screen.getByRole("heading", {
    level: 1,
    name: "Transações de débito",
  });
  expect(title).toBeDefined();
  expect(DatePickerWithRange).toHaveBeenCalled();
  expect(TransactionsDataTable).toHaveBeenCalled();
});
