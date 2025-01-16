import CreateCategory, {
  CreateCategoryInput,
  CreateCategoryOutput,
} from "@/core/application/usecase/category/CreateCategory";
import DeleteCategory from "@/core/application/usecase/category/DeleteCategory";
import GetCategory, { GetCategoryOutput } from "@/core/application/usecase/category/GetCategory";
import UpdateCategory, { UpdateCategoryInput } from "@/core/application/usecase/category/UpdateCategory";
import UseCase from "@/core/application/usecase/UseCase";
import DatabaseConnection from "@/core/infra/database/DatabaseConnection";
import { CategoryRepositoryDatabase } from "@/core/infra/repository/CategoryRepositoryDatabase";

export type CategoryDomain = {
  CreateCategory: UseCase<CreateCategoryInput, CreateCategoryOutput>;
  GetCategory: UseCase<string, GetCategoryOutput>;
  UpdateCategory: UseCase<UpdateCategoryInput, void>;
  DeleteCategory: UseCase<string, void>;
};

export function buildCategoryDomain(databaseConnection: DatabaseConnection): CategoryDomain {
  const repository = new CategoryRepositoryDatabase(databaseConnection);
  return {
    CreateCategory: new CreateCategory(repository),
    GetCategory: new GetCategory(repository),
    UpdateCategory: new UpdateCategory(repository),
    DeleteCategory: new DeleteCategory(repository),
  };
}
