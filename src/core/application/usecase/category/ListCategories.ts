import UseCase from "@/core/application/usecase/UseCase";
import CategoryDAO, { CategoryDTO } from "@/core/domain/dao/CategoryDao";
import Pageable from "@/core/domain/util/Pageable";

export default class ListCategories implements UseCase<ListCategoriesInput, Pageable<CategoryDTO>> {
  constructor(private readonly categoryDAO: CategoryDAO) {}

  async execute(params: ListCategoriesInput): Promise<Pageable<CategoryDTO>> {
    const categories = await this.categoryDAO.list(params);
    return categories;
  }
}

export type ListCategoriesInput = {
  name?: string;
  page: number;
  size: number;
};
