import Category from "@/domain/entities/Category";
import CategoryRepository from "@/domain/repository/CategoryRepository";
import DatabaseConnection from "@/infra/database/DatabaseConnection";

export class CategoryRepositoryFake implements CategoryRepository {
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

export class CategoryRepositoryDatabase implements CategoryRepository {
  constructor(private readonly connection: DatabaseConnection) {}

  async create(category: Category): Promise<void> {
    await this.connection.query("insert into myfinances.categories (id, name) values ($1, $2)", [
      category.id,
      category.name,
    ]);
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
}
