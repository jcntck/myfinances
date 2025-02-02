import UseCase from "@/core/application/usecase/UseCase";
import Category from "@/core/domain/entities/Category";
import CategoryRepository from "@/core/application/repository/CategoryRepository";

export default class CreateCategory implements UseCase<CreateCategoryInput, CreateCategoryOutput> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const category = Category.create(input);
    const categoryExists = await this.categoryRepository.findByName(category.name);
    if (categoryExists) throw new Error("[CreateCategory] Category already exists");
    await this.categoryRepository.create(category);
    return {
      categoryId: category.id,
    };
  }
}

export type CreateCategoryInput = {
  name: string;
};

export type CreateCategoryOutput = {
  categoryId: string;
};
