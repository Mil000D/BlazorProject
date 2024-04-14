import { load } from "../dist/sql-httpvfs.js";

const databaseWorker = await load("../database/db.db");

window.loadAllTabs = async () => {
    const tabs = await databaseWorker.db.query("SELECT * FROM tab");
    return tabs;
}
window.loadAllSubTabs = async () => {
    const subTabs = await databaseWorker.db.query("SELECT * FROM subtab");
    return subTabs;
}

window.loadTab(id) = async () => { 
    const tab = await databaseWorker.db.query("SELECT * FROM tab WHERE id = ?", [id]);
    return tab;
}

window.loadSubTab(id) = async () => {
    const subTab = await databaseWorker.db.query("SELECT * FROM subtab WHERE id = ?", [id]);
    return subTab;
}