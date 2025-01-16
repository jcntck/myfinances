import CreateDebitTransaction, {
  CreateDebitTransactionInput,
  CreateDebitTransactionOutput,
} from "@/core/application/usecase/debit-transactions/CreateDebitTransaction";
import DeleteDebitTransaction from "@/core/application/usecase/debit-transactions/DeleteDebitTransaction";
import GetDebitTransaction, {
  GetDebitTransactionOutput,
} from "@/core/application/usecase/debit-transactions/GetDebitTransaction";
import UpdateDebitTransaction, {
  UpdateDebitTransactionInput,
} from "@/core/application/usecase/debit-transactions/UpdateDebitTransaction";
import UseCase from "@/core/application/usecase/UseCase";
import DatabaseConnection from "@/core/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/core/infra/repository/CategoryRepositoryDatabase";
import { TransactionRepositoryDatabase } from "@/core/infra/repository/TransactionRepositoryDatabase";

export type DebitTransactionDomain = {
  CreateDebitTransaction: UseCase<CreateDebitTransactionInput, CreateDebitTransactionOutput>;
  GetDebitTransaction: UseCase<string, GetDebitTransactionOutput>;
  UpdateDebitTransaction: UseCase<UpdateDebitTransactionInput, void>;
  DeleteDebitTransaction: UseCase<string, void>;
};

export function buildDebitTransactionDomain(databaseConnection: DatabaseConnection): DebitTransactionDomain {
  const transactionRepository = new TransactionRepositoryDatabase(databaseConnection);
  const categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
  return {
    CreateDebitTransaction: new CreateDebitTransaction(transactionRepository, categoryRepository),
    GetDebitTransaction: new GetDebitTransaction(transactionRepository),
    UpdateDebitTransaction: new UpdateDebitTransaction(transactionRepository, categoryRepository),
    DeleteDebitTransaction: new DeleteDebitTransaction(transactionRepository),
  };
}
