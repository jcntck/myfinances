import CreateDebitTransaction, {
  CreateDebitTransactionInput,
  CreateDebitTransactionOutput,
} from "@/core/application/usecase/debit-transactions/CreateDebitTransaction";
import CreateDebitTransactionList, {
  CreateDebitTransactionListInput,
} from "@/core/application/usecase/debit-transactions/ImportDebitTransactions";
import DeleteDebitTransaction from "@/core/application/usecase/debit-transactions/DeleteDebitTransaction";
import GetDebitTransaction, {
  GetDebitTransactionOutput,
} from "@/core/application/usecase/debit-transactions/GetDebitTransaction";
import ListDebitTransactionsByRange, {
  ListDebitTransactionsByRangeInput,
} from "@/core/application/usecase/debit-transactions/ListDebitTransactionsByRange";
import UpdateDebitTransaction, {
  UpdateDebitTransactionInput,
} from "@/core/application/usecase/debit-transactions/UpdateDebitTransaction";
import UseCase from "@/core/application/usecase/UseCase";
import { TransactionDTO } from "@/core/domain/dao/TransactionDao";
import TransactionDAODatabase from "@/core/infra/dao/TransactionDaoDatabase";
import DatabaseConnection from "@/core/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/core/infra/repository/CategoryRepositoryDatabase";
import { TransactionRepositoryDatabase } from "@/core/infra/repository/TransactionRepositoryDatabase";

export type DebitTransactionDomain = {
  ListTransactionsByRange: UseCase<ListDebitTransactionsByRangeInput, TransactionDTO[]>;
  CreateDebitTransaction: UseCase<CreateDebitTransactionInput, CreateDebitTransactionOutput>;
  CreateDebitTransactionList: UseCase<CreateDebitTransactionListInput, string[]>;
  GetDebitTransaction: UseCase<string, GetDebitTransactionOutput>;
  UpdateDebitTransaction: UseCase<UpdateDebitTransactionInput, void>;
  DeleteDebitTransaction: UseCase<string, void>;
};

export function buildDebitTransactionDomain(databaseConnection: DatabaseConnection): DebitTransactionDomain {
  const transactionRepository = new TransactionRepositoryDatabase(databaseConnection);
  const categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
  const transactionDAO = new TransactionDAODatabase(databaseConnection);
  return {
    ListTransactionsByRange: new ListDebitTransactionsByRange(transactionDAO),
    CreateDebitTransaction: new CreateDebitTransaction(transactionRepository, categoryRepository),
    CreateDebitTransactionList: new CreateDebitTransactionList(transactionRepository, categoryRepository),
    GetDebitTransaction: new GetDebitTransaction(transactionRepository),
    UpdateDebitTransaction: new UpdateDebitTransaction(transactionRepository, categoryRepository),
    DeleteDebitTransaction: new DeleteDebitTransaction(transactionRepository),
  };
}
