import CategoryDAO, { CategoryDTO } from "@/core/domain/dao/CategoryDao";
import Pageable from "@/core/domain/util/Pageable";
import DatabaseConnection from "@/core/infra/database/DatabaseConnection";
import PageUtil from "@/core/infra/util/PageUtil";

export default class CategoryDAODatabase implements CategoryDAO {
  constructor(private readonly db: DatabaseConnection) {}

  async list({ name, page, size }: { name?: string; page: number; size: number }): Promise<Pageable<CategoryDTO>> {
    let query = "SELECT * FROM myfinances.categories";
    const whereClauses = [];

    if (name) {
      const nameWhereClause = this.db.buildStatement("WHERE myfinances.unaccent(name) ILIKE myfinances.unaccent($1)", [
        `%${name}%`,
      ]);
      whereClauses.push(nameWhereClause);
    }

    const [{ count: totalItems }] = await this.db.query(
      "SELECT count(*) FROM myfinances.categories " + whereClauses.join(" ")
    );
    const totalPages = PageUtil.calculatePage(totalItems, size);
    const offset = PageUtil.calculateOffset(page, size);
    query += ` ${whereClauses.join(" ")} ${this.db.buildStatement("LIMIT $1 OFFSET $2;", [size, offset])}`;
    const items = await this.db.query(query);

    return {
      items,
      currentPage: page,
      totalItems,
      totalPages,
    };
  }
}
