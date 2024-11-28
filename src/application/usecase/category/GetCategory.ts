import UseCase from "@/application/usecase/UseCase";
import CategoryRepository from "@/domain/repository/CategoryRepository";

export default class GetCategory implements UseCase<string, Output> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(categoryId: string): Promise<Output> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) throw new Error("[GetCategory] Category not found");
    return {
      id: category.id,
      name: category.name,
    };
  }
}

type Output = {
  id: string;
  name: string;
};
