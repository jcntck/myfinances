import UUID from "@/core/domain/vo/UUID";
import { addMonths } from "date-fns";

export default class Installment {
  private _id: UUID;

  constructor(id: string, readonly date: Date, readonly value: number, readonly installmentNumber: number) {
    this._id = new UUID(id);
  }

  get id(): string {
    return this._id.getValue();
  }

  static create(date: Date, value: number, maxInstallments: number): Installment[] {
    let installments = [];
    for (let index = 0; index < maxInstallments; index++) {
      const id = UUID.create().getValue();
      const dueDate = addMonths(date, index);
      installments.push(new Installment(id, dueDate, value, index + 1));
    }
    return installments;
  }
}
