import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("notes.db");

// Создание таблицы
await db.execAsync(`
  CREATE TABLE IF NOT EXISTS notes (
    id TEXT PRIMARY KEY,
    title TEXT,
    content TEXT,
    tags TEXT (JSON array),
    createdAt TEXT (ISO),
    modifiedAt TEXT (ISO),
    color TEXT
  );
`);
