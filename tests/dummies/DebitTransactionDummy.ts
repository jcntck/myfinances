const plusOrMinus = () => (Math.random() < 0.5 ? -1 : 1);

export default class DebitTransactionDummy {
  static create({ categoryId }: CreateInput): CreateOutput {
    return {
      date: new Date(),
      description: `DebitTransaction Description ${Date.now()}`,
      value: parseFloat((Math.random() * 1000).toFixed(2)) * plusOrMinus(),
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
