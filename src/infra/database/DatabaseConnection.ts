import pgp from "pg-promise";

export default interface DatabaseConnection {
  query(statement: string, params?: any[]): Promise<any>;
  disconnect(): Promise<void>;
  truncate(tables: string[]): Promise<void>;
}

export class PgPromiseAdapter implements DatabaseConnection {
  private connection: pgp.IDatabase<any>;

  constructor() {
    const host = process.env.POSTGRES_HOST;
    const port = process.env.POSTGRES_PORT;
    const user = process.env.POSTGRES_USER;
    const password = process.env.POSTGRES_PASSWORD;
    const database = process.env.POSTGRES_DATABASE;
    this.connection = pgp()(`postgres://${user}:${password}@${host}:${port}/${database}`);
  }

  async query(statement: string, params?: any[]): Promise<any> {
    return this.connection.query(statement, params);
  }

  async disconnect(): Promise<void> {
    await this.connection.$pool.end();
  }

  async truncate(tables: string[]): Promise<void> {
    const tablesString = tables.join(", ");
    await this.query(`TRUNCATE ${tablesString} RESTART IDENTITY CASCADE`);
  }
}
