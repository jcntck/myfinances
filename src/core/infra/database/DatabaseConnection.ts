import pgp from "pg-promise";

export default interface DatabaseConnection {
  buildStatement(statement: string, params?: any[]): string;
  query(statement: string, params?: any[]): Promise<any>;
  transaction(statements: string[], tag?: string): Promise<any>;
  disconnect(): Promise<void>;
  truncate(tables: string[]): Promise<void>;
}

export class PgPromiseAdapter implements DatabaseConnection {
  private connection: pgp.IDatabase<any>;
  private static instance: DatabaseConnection;

  constructor() {
    const host = process.env.POSTGRES_HOST;
    const port = process.env.POSTGRES_PORT;
    const user = process.env.POSTGRES_USER;
    const password = process.env.POSTGRES_PASSWORD;
    const database = process.env.POSTGRES_DATABASE;

    this.connection = pgp()(`postgres://${user}:${password}@${host}:${port}/${database}`);
  }

  static get Instance(): DatabaseConnection {
    if (!PgPromiseAdapter.instance) PgPromiseAdapter.instance = new PgPromiseAdapter();
    return PgPromiseAdapter.instance;
  }

  buildStatement(statement: string, params?: any[]): string {
    return pgp.as.format(statement, params);
  }

  async query(statement: string, params?: any[]): Promise<any> {
    return this.connection.query(statement, params);
  }

  async transaction(statements: string[], tag: string = "application-transaction"): Promise<any> {
    return this.connection.tx(tag, (t) => {
      let q = [];
      for (const statement of statements) {
        q.push(t.any(statement));
      }
      return t.batch(q);
    });
  }

  async disconnect(): Promise<void> {
    await this.connection.$pool.end();
  }

  async truncate(tables: string[]): Promise<void> {
    const tablesString = tables.join(", ");
    await this.query(`TRUNCATE ${tablesString} RESTART IDENTITY CASCADE`);
  }
}
