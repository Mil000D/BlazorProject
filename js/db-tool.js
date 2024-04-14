import { load } from "./dist/sql-httpvfs.js";
export const databaseWorker = await load("../database/db.db");