import Application from "@/Application";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const { ListTransactionsByRange } = Application.Instance.DebitTransaction;

  const startDate = searchParams.has("from") ? new Date(searchParams.get("from")!) : new Date();
  const endDate = searchParams.has("to") ? new Date(searchParams.get("to")!) : new Date();
  const transactions = await ListTransactionsByRange.execute({
    startDate,
    endDate,
  });

  return Response.json(transactions);
}
