import mysql, { Connection } from 'mysql2/promise';

let db: Connection | undefined;

export async function connectToDatabase(): Promise<Connection> {
  if (!db) {
    db = await mysql.createConnection({
      host: process.env.DB_HOST as string,
      user: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      database: process.env.DB_NAME as string,
    });
  }
  return db;
}
