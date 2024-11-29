import Category from "@/domain/entities/Category";
import CategoryRepository from "@/domain/repository/CategoryRepository";
import DatabaseConnection from "@/infra/database/DatabaseConnection";

export class CategoryRepositoryDatabase implements CategoryRepository {
  constructor(private readonly connection: DatabaseConnection) {}

  async create(category: Category): Promise<void> {
    await this.connection.query("insert into myfinances.categories (id, name) values ($1, $2)", [
      category.id,
      category.name,
    ]);
  }

  async update(category: Category): Promise<void> {
    await this.connection.query("update myfinances.categories set name = $1 where id = $2", [
      category.name,
      category.id,
    ]);
  }

  async delete(id: string): Promise<void> {
    await this.connection.query("delete from myfinances.categories where id = $1", [id]);
  }

  async findById(id: string): Promise<Category | undefined> {
    const [categoryData] = await this.connection.query("select * from myfinances.categories where id = $1", [id]);
    if (!categoryData) return undefined;
    return new Category(categoryData.id, categoryData.name);
  }

  async findByName(name: string): Promise<Category | undefined> {
    const [categoryData] = await this.connection.query("select * from myfinances.categories where name = $1", [name]);
    if (!categoryData) return undefined;
    return new Category(categoryData.id, categoryData.name);
  }

  async hasTransactions(id: string): Promise<boolean> {
    const [count] = await this.connection.query(
      "select count(*)::integer as count from myfinances.transactions where category_id = $1",
      [id]
    );
    return count.count > 0;
  }
}
