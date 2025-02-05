import mysql, { Connection } from "mysql2/promise";

let db: Connection | undefined;

export async function connectToDatabase(): Promise<Connection> {
  if (!db) {
    db = await mysql.createConnection({
      host: process.env.DB_HOST as string,
      user: process.env.DB_USER as string,
      password: process.env.DB_PASSWORD as string,
      database: process.env.DB_NAME as string,
    });

    await initializeDatabase(db);
  }
  return db;
}

async function initializeDatabase(db: Connection) {
  // Create 'events' table if it doesn't exist
  await db.execute(`
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
      title VARCHAR(255) NOT NULL,
      type VARCHAR(255) NOT NULL,
      format VARCHAR(255) NOT NULL,
      attend INT DEFAULT 0,
      eventDate VARCHAR(255),
      note VARCHAR(255),
      status VARCHAR(255) DEFAULT '非公開(下書き)',
      priority TINYINT DEFAULT 0,
      prefecture VARCHAR(255),
      address1 VARCHAR(255),
      address2 VARCHAR(255),
      imgUrl VARCHAR(255),
      mainImg INT DEFAULT 0,
      tag VARCHAR(255),
      feature VARCHAR(255),
      benefit VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
      deletedAt TIMESTAMP NULL
    )
`);

  // Create 'campaign' table if it doesn't exist
  await db.execute(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
      title VARCHAR(255) NOT NULL,
      type VARCHAR(255) NOT NULL,
      format VARCHAR(255) NOT NULL,
      status VARCHAR(255) DEFAULT '非公開(下書き)',
      eventDate VARCHAR(255),
      prefecture VARCHAR(255),
      address1 VARCHAR(255),
      address2 VARCHAR(255),
      featuredEvent VARCHAR(255),
      imgUrl VARCHAR(255),
      mainImg INT DEFAULT 0,
      article VARCHAR(1000),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL ON UPDATE CURRENT_TIMESTAMP,
      deletedAt TIMESTAMP NULL
    )
  `);
}
