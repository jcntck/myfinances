import UseCase from "@/core/application/usecase/UseCase";
import CategoryRepository from "@/core/application/repository/CategoryRepository";

export default class GetCategory implements UseCase<string, GetCategoryOutput> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(categoryId: string): Promise<GetCategoryOutput> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) throw new Error("[GetCategory] Category not found");
    return {
      id: category.id,
      name: category.name,
    };
  }
}

export type GetCategoryOutput = {
  id: string;
  name: string;
};
