import { load } from "../dist/sql-httpvfs.js";

const databaseWorker = await load("../database/db.db");

export async function loadTab(id) {
    try {
        const tab = await databaseWorker.db.query(`SELECT * FROM Tab WHERE Id = ${id}`);
        return tab[0];
    } catch (error) {
        console.error(`Error loading tab: ${error}`);
        return null;
    }
}

export async function loadSubTab(id) {
    try {
        const subTab = await databaseWorker.db.query(`SELECT * FROM SubTab WHERE Id = ${id}`);
        return subTab[0];
    } catch (error) {
        console.error(`Error loading subtab: ${error}`);
        return null;
    }
}

export async function loadPageContent(href) {
    try {
        console.log(`Loading page content for href: ${href}`);
        const pageContent = await databaseWorker.db.query(`SELECT * FROM PageContent WHERE Href = '${href}'`);

        if (pageContent.length === 0) {
            console.error(`No page content found for href: ${href}`);

            // Try to find the tab or subtab name based on the href
            let tabName = "New Page";
            const tabs = await databaseWorker.db.query(`SELECT * FROM Tab`);

            for (const tab of tabs) {
                if (tab.Href === href) {
                    tabName = tab.Name;
                    break;
                }

                // Check subtabs
                const subTabs = await databaseWorker.db.query(`SELECT * FROM SubTab WHERE TabId = ${tab.Id}`);
                const matchingSubTab = subTabs.find(subTab => subTab.Href === href);
                if (matchingSubTab) {
                    tabName = matchingSubTab.Name;
                    break;
                }
            }

            // Return default content as JSON string
            const defaultContent = {
                Title: tabName,
                ContentBlocks: [
                    {
                        Type: "header",
                        Content: tabName,
                        WidthPercent: 100,
                        CustomValue: 0
                    },
                    {
                        Type: "text",
                        Content: "Ta strona jest w trakcie tworzenia...",
                        WidthPercent: 100,
                        CustomValue: -1
                    }
                ]
            };
            return JSON.stringify(defaultContent);
        }

        // Return the JSON content as a string
        console.log(`Successfully loaded page content: ${pageContent[0].ContentJson}`);
        return pageContent[0].ContentJson;
    } catch (error) {
        console.error(`Error loading page content: ${error}`);

        // Return error content as JSON string
        const errorContent = {
            Title: "Error",
            ContentBlocks: [
                {
                    Type: "header",
                    Content: "Error Loading Page",
                    WidthPercent: 100,
                    CustomValue: 0
                },
                {
                    Type: "text",
                    Content: `An error occurred while loading the page: ${error.message}`,
                    WidthPercent: 100,
                    CustomValue: -1
                }
            ]
        };
        return JSON.stringify(errorContent);
    }
}

export async function loadPage(id) {
    try {
        const page = await databaseWorker.db.query(`SELECT * FROM Page WHERE Id = '${id}'`);
        if (page.length === 0) return null;

        // Get page paragraphs
        const paragraphs = await databaseWorker.db.query(`SELECT * FROM Paragraph WHERE PageId = '${id}' ORDER BY Position`);

        // Get media for each paragraph
        for (let i = 0; i < paragraphs.length; i++) {
            const media = await databaseWorker.db.query(`SELECT * FROM Media WHERE Id = '${paragraphs[i].ImageId}'`);
            if (media.length > 0) {
                paragraphs[i].Image = media[0];
            }
        }

        // Get header image
        const headerImage = await databaseWorker.db.query(`SELECT * FROM Media WHERE Id = '${page[0].HeaderImageId}'`);
        if (headerImage.length > 0) {
            page[0].HeaderImage = headerImage[0];
        }

        page[0].Paragraphs = paragraphs;
        return page[0];
    } catch (error) {
        console.error(`Error loading page: ${error}`);
        return null;
    }
}

export async function loadPageCards() {
    try {
        // Alias [Order] to CardOrder and order by the alias
        const results = await databaseWorker.db.query(`SELECT Id, Source, Col, Text, Title, Href, [Order] AS CardOrder FROM PageCard ORDER BY CardOrder`);
        // Rename CardOrder back to Order for C# compatibility
        const pageCards = results.map(card => {
            card.Order = card.CardOrder;
            delete card.CardOrder;
            return card;
        });
        return pageCards;
    } catch (error) {
        console.error(`Error loading page cards: ${error}`);
        return [];
    }
}

export async function loadPageCardsByPage(page, pageSize = 6) {
    try {
        const offset = (page - 1) * pageSize;
        // Alias [Order] to CardOrder and order by the alias
        const results = await databaseWorker.db.query(`SELECT Id, Source, Col, Text, Title, Href, [Order] AS CardOrder FROM PageCard ORDER BY CardOrder LIMIT ${pageSize} OFFSET ${offset}`);
        // Rename CardOrder back to Order for C# compatibility
        const pageCards = results.map(card => {
            card.Order = card.CardOrder;
            delete card.CardOrder;
            return card;
        });
        return pageCards;
    } catch (error) {
        console.error(`Error loading page cards by page: ${error}`);
        return [];
    }
}

export async function getPageCardsCount() {
    try {
        const count = await databaseWorker.db.query(`SELECT COUNT(*) as count FROM PageCard`);
        return count[0].count;
    } catch (error) {
        console.error(`Error getting page cards count: ${error}`);
        return 0;
    }
}