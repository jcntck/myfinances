import CreateCreditTransaction, {
  CreateCreditTransactionInput,
  CreateCreditTransactionOutput,
} from "@/core/application/usecase/credit-transactions/CreateCreditTransaction";
import DeleteCreditTransaction from "@/core/application/usecase/credit-transactions/DeleteCreditTransaction";
import GetCreditTransaction, {
  GetCreditTransactionOutput,
} from "@/core/application/usecase/credit-transactions/GetCreditTransaction";
import ImportCreditTransactions, {
  ImportCreditTransactionsInput,
} from "@/core/application/usecase/credit-transactions/ImportCreditTransactions";
import ListCreditTransactionsByRange, {
  ListCreditTransactionsByRangeInput,
} from "@/core/application/usecase/credit-transactions/ListCreditTransactionsByRange";
import UpdateCreditTransaction, {
  UpdateCreditTransactionInput,
} from "@/core/application/usecase/credit-transactions/UpdateCreditTransaction";
import UseCase from "@/core/application/usecase/UseCase";
import { CreditTransactionDTO } from "@/core/domain/dao/TransactionDao";
import CreditTransactionDAODatabase from "@/core/infra/dao/CreditTransactionDaoDatabase";
import DatabaseConnection from "@/core/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/core/infra/repository/CategoryRepositoryDatabase";
import { CreditTransactionRepositoryDatabase } from "@/core/infra/repository/CreditTransactionRepositoryDatabase";

export type CreditTransactionDomain = {
  ListTransactionsByRange: UseCase<ListCreditTransactionsByRangeInput, CreditTransactionDTO[]>;
  CreateCreditTransaction: UseCase<CreateCreditTransactionInput, CreateCreditTransactionOutput>;
  ImportCreditTransactions: UseCase<ImportCreditTransactionsInput, void>;
  GetCreditTransaction: UseCase<string, GetCreditTransactionOutput>;
  UpdateCreditTransaction: UseCase<UpdateCreditTransactionInput, void>;
  DeleteCreditTransaction: UseCase<string, void>;
};

export function buildCreditTransactionDomain(databaseConnection: DatabaseConnection): CreditTransactionDomain {
  const transactionRepository = new CreditTransactionRepositoryDatabase(databaseConnection);
  const categoryRepository = new CategoryRepositoryDatabase(databaseConnection);
  const transactionDAO = new CreditTransactionDAODatabase(databaseConnection);
  return {
    ListTransactionsByRange: new ListCreditTransactionsByRange(transactionDAO),
    CreateCreditTransaction: new CreateCreditTransaction(transactionRepository, categoryRepository),
    ImportCreditTransactions: new ImportCreditTransactions(transactionRepository, categoryRepository),
    GetCreditTransaction: new GetCreditTransaction(transactionRepository),
    UpdateCreditTransaction: new UpdateCreditTransaction(transactionRepository, categoryRepository),
    DeleteCreditTransaction: new DeleteCreditTransaction(transactionRepository),
  };
}
