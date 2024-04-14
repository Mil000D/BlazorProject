import { load } from "../dist/sql-httpvfs.js";

const databaseWorker = await load("../database/db.db");

export async function loadAllTabs() {
    const tabs = await databaseWorker.db.query("SELECT * FROM tab");
    return tabs;
}
export async function loadAllSubTabs() {
    const subTabs = await databaseWorker.db.query("SELECT * FROM subtab");
    return subTabs;
}