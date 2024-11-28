import CreateCategory, {
  CreateCategoryInput,
  CreateCategoryOutput,
} from "@/application/usecase/category/CreateCategory";
import GetCategory, { GetCategoryOutput } from "@/application/usecase/category/GetCategory";
import UseCase from "@/application/usecase/UseCase";
import CategoryRepositoryFake from "@/infra/repository/CategoryRepository";

export default class Application {
  private static instance: Application;
  private category: CategoryDomain;

  private constructor() {
    const categoryRepository = new CategoryRepositoryFake();
    this.category = {
      CreateCategory: new CreateCategory(categoryRepository),
      GetCategory: new GetCategory(categoryRepository),
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
