import Category from "@/domain/entities/Category";

export default interface CategoryRepository {
  create(category: Category): Promise<void>;
  update(category: Category): Promise<void>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Category | undefined>;
  findByName(name: string): Promise<Category | undefined>;
  hasTransactions(id: string): Promise<boolean>;
}
