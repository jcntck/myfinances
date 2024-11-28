import UseCase from "@/application/usecase/UseCase";
import Category from "@/domain/entities/Category";
import CategoryRepository from "@/domain/repository/CategoryRepository";

export default class CreateCategory implements UseCase<Input, Output> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: Input): Promise<Output> {
    const category = Category.create(input);
    const categoryExists = await this.categoryRepository.findByName(category.name);
    if (categoryExists) throw new Error("[CreateCategory] Category already exists");
    await this.categoryRepository.create(category);
    return {
      categoryId: category.id,
    };
  }
}

type Input = {
  name: string;
};

type Output = {
  categoryId: string;
};
