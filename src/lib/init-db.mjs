process.env.DB_INIT_MODE = "1";

await import("./db.js");
console.log("Database initialised at data/ghana-expats.db");
