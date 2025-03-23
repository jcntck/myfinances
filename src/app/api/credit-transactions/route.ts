import Application from "@/Application";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const { ListTransactionsByRange } = Application.Instance.CreditTransaction;

    const startDate = searchParams.has("from") ? new Date(searchParams.get("from")!) : new Date();
    const endDate = searchParams.has("to") ? new Date(searchParams.get("to")!) : new Date();
    const transactions = await ListTransactionsByRange.execute({
      startDate,
      endDate,
    });

    return Response.json(transactions);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
