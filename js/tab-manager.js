import { load } from "../dist/sql-httpvfs.js";

const databaseWorker = await load("../database/db.db");

export async function loadAllTabs() {
    try {
        console.log("Loading all tabs");
        const tabs = await databaseWorker.db.query("SELECT * FROM Tab");
        console.log(`Successfully loaded ${tabs.length} tabs`);
        return tabs;
    } catch (error) {
        console.error(`Error loading tabs: ${error}`);
        return [];
    }
}

export async function loadTab(id) {
    try {
        console.log(`Loading tab with id: ${id}`);
        const tab = await databaseWorker.db.query(`SELECT * FROM Tab WHERE Id = ${id}`);
        if (tab.length === 0) {
            console.error(`No tab found with id: ${id}`);
            return null;
        }
        console.log(`Successfully loaded tab: ${JSON.stringify(tab[0])}`);
        return tab[0];
    } catch (error) {
        console.error(`Error loading tab: ${error}`);
        return null;
    }
}

export async function loadSubTab(id) {
    try {
        console.log(`Loading subtab with id: ${id}`);
        const subTab = await databaseWorker.db.query(`SELECT * FROM SubTab WHERE Id = ${id}`);
        if (subTab.length === 0) {
            console.error(`No subtab found with id: ${id}`);
            return null;
        }
        console.log(`Successfully loaded subtab: ${JSON.stringify(subTab[0])}`);
        return subTab[0];
    } catch (error) {
        console.error(`Error loading subtab: ${error}`);
        return null;
    }
}

export async function loadAllSubTabs() {
    try {
        console.log("Loading all subtabs");
        const subTabs = await databaseWorker.db.query(`SELECT * FROM SubTab`);
        console.log(`Successfully loaded ${subTabs.length} subtabs`);
        return subTabs;
    } catch (error) {
        console.error(`Error loading subtabs: ${error}`);
        return [];
    }
}

export async function loadTabsWithSubTabs() {
    try {
        const tabs = await loadAllTabs();
        const subTabs = await loadAllSubTabs();
        
        // Assign subtabs to their parent tabs
        for (let i = 0; i < tabs.length; i++) {
            tabs[i].subTabs = subTabs.filter(subTab => subTab.TabId === tabs[i].Id);
        }
        
        return tabs;
    } catch (error) {
        console.error(`Error loading tabs with subtabs: ${error}`);
        return [];
    }
}

export async function loadSubTabsByTabId(tabId) {
    try {
        console.log(`Loading subtabs for tab id: ${tabId}`);
        const subTabs = await databaseWorker.db.query(`SELECT * FROM SubTab WHERE TabId = ${tabId}`);
        console.log(`Successfully loaded ${subTabs.length} subtabs for tab id: ${tabId}`);
        return subTabs;
    } catch (error) {
        console.error(`Error loading subtabs by tab ID: ${error}`);
        return [];
    }
}
