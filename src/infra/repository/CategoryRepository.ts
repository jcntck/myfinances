import Category from "@/domain/entities/Category";
import CategoryRepository from "@/domain/repository/CategoryRepository";

export default class CategoryRepositoryFake implements CategoryRepository {
  private categories: Category[] = [];

  async create(category: Category): Promise<void> {
    this.categories.push(category);
  }

  async findById(id: string): Promise<Category | undefined> {
    return this.categories.find((category) => category.id === id);
  }

  async findByName(name: string): Promise<Category | undefined> {
    return this.categories.find((category) => category.name.toLocaleLowerCase() === name.toLocaleLowerCase());
  }
}
