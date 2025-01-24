import { buildCategoryDomain, CategoryDomain } from "@/core/infra/builder/domain/Category";
import { buildCreditTransactionDomain, CreditTransactionDomain } from "@/core/infra/builder/domain/CreditTransaction";
import { buildDebitTransactionDomain, DebitTransactionDomain } from "@/core/infra/builder/domain/DebitTransaction";
import DatabaseConnection, { PgPromiseAdapter } from "@/core/infra/database/DatabaseConnection";

export default class Application {
  private static instance: Application;
  private databaseConnection!: DatabaseConnection;
  private categoryDomain!: CategoryDomain;
  private debitTransactionDomain!: DebitTransactionDomain;
  private creditTransactionDomain!: CreditTransactionDomain;

  private constructor() {
    this.register();
  }

  static get Instance(): Application {
    if (!Application.instance) Application.instance = new Application();
    return Application.instance;
  }

  get Category(): CategoryDomain {
    return this.categoryDomain;
  }

  get DebitTransaction(): DebitTransactionDomain {
    return this.debitTransactionDomain;
  }

  get CreditTransaction(): CreditTransactionDomain {
    return this.creditTransactionDomain;
  }

  register(): void {
    this.databaseConnection = PgPromiseAdapter.Instance;
    this.categoryDomain = buildCategoryDomain(this.databaseConnection);
    this.debitTransactionDomain = buildDebitTransactionDomain(this.databaseConnection);
    this.creditTransactionDomain = buildCreditTransactionDomain(this.databaseConnection);
  }
}
