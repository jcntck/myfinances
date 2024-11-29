import UseCase from "@/application/usecase/UseCase";
import Category from "@/domain/entities/Category";
import CategoryRepository from "@/domain/repository/CategoryRepository";

export default class UpdateCategory implements UseCase<UpdateCategoryInput, void> {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<void> {
    const category = await this.categoryRepository.findById(input.id);
    if (!category) throw new Error("[UpdateCategory] Category not found");
    const updatedCategory = new Category(category.id, input.name);
    const categoryExists = await this.categoryRepository.findByName(updatedCategory.name);
    if (categoryExists) throw new Error("[UpdateCategory] Category with name already exists");
    await this.categoryRepository.update(updatedCategory);
  }
}

type UpdateCategoryInput = {
  id: string;
  name: string;
};
