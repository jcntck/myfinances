import CreateCategory, {
  CreateCategoryInput,
  CreateCategoryOutput,
} from "@/application/usecase/category/CreateCategory";
import GetCategory, { GetCategoryOutput } from "@/application/usecase/category/GetCategory";
import UseCase from "@/application/usecase/UseCase";
import CategoryRepository from "@/domain/repository/CategoryRepository";
import DatabaseConnection, { PgPromiseAdapter } from "@/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/infra/repository/CategoryRepository";

export default class Application {
  private static instance: Application;
  private databaseConnection!: DatabaseConnection;
  private categoryRepository!: CategoryRepository;
  private category!: CategoryDomain;

  private constructor() {
    if (process.env.NODE_ENV !== "test") this.register();
  }

  register(databaseConnection?: DatabaseConnection, categoryRepository?: CategoryRepository): void {
    this.databaseConnection = databaseConnection ?? new PgPromiseAdapter();
    this.categoryRepository = categoryRepository ?? new CategoryRepositoryDatabase(this.databaseConnection);
    this.category = {
      CreateCategory: new CreateCategory(this.categoryRepository),
      GetCategory: new GetCategory(this.categoryRepository),
    };
  }

  static get Instance(): Application {
    if (!Application.instance) Application.instance = new Application();
    return Application.instance;
  }

  get Category(): CategoryDomain {
    return this.category;
  }
}

type CategoryDomain = {
  CreateCategory: UseCase<CreateCategoryInput, CreateCategoryOutput>;
  GetCategory: UseCase<string, GetCategoryOutput>;
};
