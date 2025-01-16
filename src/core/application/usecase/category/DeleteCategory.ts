import UseCase from "@/core/application/usecase/UseCase";
import CategoryRepository from "@/core/domain/repository/CategoryRepository";

export default class DeleteCategory implements UseCase<string, void> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(categoryId: string): Promise<void> {
    const hasTransactions = await this.categoryRepository.hasTransactions(categoryId);
    if (hasTransactions) throw new Error("[DeleteCategory] Category has transactions");
    await this.categoryRepository.delete(categoryId);
  }
}
