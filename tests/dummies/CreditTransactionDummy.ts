export default class CreditTransactionDummy {
  static create({ date, description, categoryId, numberOfInstallments, isRecurring }: CreateInput): CreateOutput {
    return {
      date: date ?? new Date(),
      description: description ?? `CreditTransaction Description ${Date.now()}`,
      value: parseFloat((Math.random() * 1000).toFixed(2)) * -1,
      categoryId,
      ...((numberOfInstallments && { numberOfInstallments }) || {}),
      ...((isRecurring && { isRecurring }) || {}),
    };
  }

  static update(input: UpdateInput): UpdateOutput {
    return {
      id: input.transactionId,
      description: `CreditTransaction Description ${Date.now()}`,
      categoryId: input.categoryId,
      status: input.status ?? "pending",
    };
  }
}

type CreateInput = {
  date?: Date;
  description?: string;
  categoryId: string;
  numberOfInstallments?: number;
  isRecurring?: boolean;
};

type CreateOutput = {
  date: Date;
  description: string;
  value: number;
  categoryId: string;
  numberOfInstallments?: number;
  isRecurring?: boolean;
};

type UpdateInput = {
  transactionId: string;
  categoryId: string;
  status?: string;
};

type UpdateOutput = {
  id: string;
  description: string;
  categoryId: string;
  status: string;
};
