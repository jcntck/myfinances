export default class CreditTransactionDummy {
  static create({ categoryId, installments }: CreateInput): CreateOutput {
    return {
      date: new Date(),
      description: `CreditTransaction Description ${Date.now()}`,
      value: parseFloat((Math.random() * 1000).toFixed(2)) * -1,
      categoryId,
      ...((installments && { installments }) || {}),
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
  categoryId: string;
  installments?: number;
};

type CreateOutput = {
  date: Date;
  description: string;
  value: number;
  categoryId: string;
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
