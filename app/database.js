// database.js
const Sqlite = require("nativescript-sqlite");

let db = null;

function initDB() {
  if (db) {
    return Promise.resolve(db);
  }

  return new Sqlite("mydb.db").then(database => {
    db = database;

    // Tabla usuarios (username UNIQUE)
    db.execSQL(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)"
    );

    // Inserta admin SOLO si no existe
    db.get("SELECT id FROM users WHERE username = ?", ["admin"], (err, row) => {
      if (!row) {
        db.execSQL("INSERT INTO users (username, password) VALUES (?, ?)", ["admin", "1234"]);
      }
    });

    // Tabla vehículos
    db.execSQL(
      "CREATE TABLE IF NOT EXISTS vehicles (id INTEGER PRIMARY KEY AUTOINCREMENT, plate TEXT, type TEXT)"
    );

    return db;
  });
}

function getDB() {
  return db;
}

module.exports = {
  initDB,
  getDB
};
