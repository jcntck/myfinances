import CreateCategory, {
  CreateCategoryInput,
  CreateCategoryOutput,
} from "@/application/usecase/category/CreateCategory";
import GetCategory, { GetCategoryOutput } from "@/application/usecase/category/GetCategory";
import CreateDebitTransaction, {
  CreateDebitTransactionInput,
  CreateDebitTransactionOutput,
} from "@/application/usecase/debit-transactions/CreateDebitTransaction";
import DeleteDebitTransaction from "@/application/usecase/debit-transactions/DeleteDebitTransaction";
import GetDebitTransaction, {
  GetDebitTransactionOutput,
} from "@/application/usecase/debit-transactions/GetDebitTransaction";
import UpdateDebitTransaction, {
  UpdateDebitTransactionInput,
} from "@/application/usecase/debit-transactions/UpdateDebitTransaction";
import UseCase from "@/application/usecase/UseCase";
import CategoryRepository from "@/domain/repository/CategoryRepository";
import TransactionRepository from "@/domain/repository/TransactionRepository";
import DatabaseConnection, { PgPromiseAdapter } from "@/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/infra/repository/CategoryRepository";
import { TransactionRepositoryDatabase } from "@/infra/repository/TransactionRepository";

export default class Application {
  private static instance: Application;
  private databaseConnection!: DatabaseConnection;
  private categoryRepository!: CategoryRepository;
  private transactionRepository!: TransactionRepository;
  private category!: CategoryDomain;
  private debitTransaction!: DebitTransactionDomain;

  private constructor() {
    if (process.env.NODE_ENV !== "test") this.register();
  }

  register(
    databaseConnection?: DatabaseConnection,
    categoryRepository?: CategoryRepository,
    transactionRepository?: TransactionRepository
  ): void {
    this.databaseConnection = databaseConnection ?? new PgPromiseAdapter();
    this.categoryRepository = categoryRepository ?? new CategoryRepositoryDatabase(this.databaseConnection);
    this.transactionRepository = transactionRepository ?? new TransactionRepositoryDatabase(this.databaseConnection);
    this.category = {
      CreateCategory: new CreateCategory(this.categoryRepository),
      GetCategory: new GetCategory(this.categoryRepository),
    };
    this.debitTransaction = {
      CreateDebitTransaction: new CreateDebitTransaction(this.transactionRepository, this.categoryRepository),
      GetDebitTransaction: new GetDebitTransaction(this.transactionRepository),
      UpdateDebitTransaction: new UpdateDebitTransaction(this.transactionRepository, this.categoryRepository),
      DeleteDebitTransaction: new DeleteDebitTransaction(this.transactionRepository),
    };
  }

  static get Instance(): Application {
    if (!Application.instance) Application.instance = new Application();
    return Application.instance;
  }

  get Category(): CategoryDomain {
    return this.category;
  }

  get DebitTransaction(): DebitTransactionDomain {
    return this.debitTransaction;
  }
}

type CategoryDomain = {
  CreateCategory: UseCase<CreateCategoryInput, CreateCategoryOutput>;
  GetCategory: UseCase<string, GetCategoryOutput>;
};

type DebitTransactionDomain = {
  CreateDebitTransaction: UseCase<CreateDebitTransactionInput, CreateDebitTransactionOutput>;
  GetDebitTransaction: UseCase<string, GetDebitTransactionOutput>;
  UpdateDebitTransaction: UseCase<UpdateDebitTransactionInput, void>;
  DeleteDebitTransaction: UseCase<string, void>;
};
