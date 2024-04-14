import { load } from "../dist/sql-httpvfs.js";

const databaseWorker = await load("../database/db.db");

export async function loadTab(id) {
    const tab = await databaseWorker.db.query(`SELECT * FROM tab WHERE id = ${id}`);
    return tab[0];
}

export async function loadSubTab(id) {
    const subTab = await databaseWorker.db.query(`SELECT * FROM subtab WHERE id = ${id}`);
    return subTab[0];
}