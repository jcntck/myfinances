export default class DebitTransactionDummy {
  static create({ categoryId }: CreateInput): CreateOutput {
    return {
      date: new Date(),
      description: `DebitTransaction Description ${Date.now()}`,
      value: 100.5,
      categoryId,
    };
  }

  static update(input: UpdateInput): UpdateOutput {
    return {
      id: input.transactionId,
      description: `DebitTransaction Description ${Date.now()}`,
      categoryId: input.categoryId,
      status: input.status ?? "pending",
    };
  }
}

type CreateInput = {
  categoryId: string;
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
