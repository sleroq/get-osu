const Database = require("better-sqlite3");
const db = new Database("./database/memory.db", { verbose: console.log });

db.prepare(
  `CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER NOT NULL UNIQUE,
      fromu TEXT,
      last_users TEXT,
      settings TEXT
  );`
).run();
async function addUser(from) {
  let uid = from.id;
  let fromString = JSON.stringify(from);
  await db
    .prepare(
      `INSERT OR IGNORE INTO users
          (user_id, fromu)
          VALUES (?, ?);`
    )
    .run(uid, fromString);
}

db.prepare(
  `CREATE TABLE IF NOT EXISTS tokens (
      token_type TEXT,
      expires_in INTEGER,
      access_token TEXT
  );`
).run();
async function getToken() {
  let token = await db
    .prepare(`SELECT access_token FROM tokens WHERE token_type = ?`)
    .get("Bearer");
  return token;
}
// updateToken("123", 12123);
async function updateToken(access_token, expires_in) {
  let oldToken = await db
    .prepare(`SELECT access_token FROM tokens WHERE token_type = ?`)
    .get("Bearer");
  if (!oldToken) {
    await db
      .prepare(
        `INSERT OR IGNORE INTO tokens
            (access_token, expires_in, token_type)
            VALUES (?, ?, ?);`
      )
      .run(access_token, expires_in, "Bearer");
  } else {
    await db
      .prepare(
        `UPDATE tokens SET
          access_token = ?,
          expires_in = ?
          WHERE token_type = ?`
      )
      .run(access_token, expires_in, "Bearer");
  }
  console.log("updated token");
}
module.exports = {
  addUser,
  getToken,
  updateToken,
};
