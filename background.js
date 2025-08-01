// Background script for Email Checker
// This file runs in the background

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        // Initialize storage
        chrome.storage.local.set({
            savedLists: [],
            settings: {
                autoValidate: true,
                batchSize: 10,
                delayBetweenRequests: 100
            }
        });
    }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.action) {
        case 'getSettings':
            chrome.storage.local.get('settings', (result) => {
                sendResponse(result.settings || {});
            });
            return true; // Async response

        case 'updateSettings':
            chrome.storage.local.set({ settings: request.settings }, () => {
                sendResponse({ success: true });
            });
            return true;

        case 'getSavedLists':
            chrome.storage.local.get('savedLists', (result) => {
                sendResponse(result.savedLists || []);
            });
            return true;

        case 'saveList':
            chrome.storage.local.get('savedLists', (result) => {
                const savedLists = result.savedLists || [];
                savedLists.push(request.listData);
                chrome.storage.local.set({ savedLists }, () => {
                    sendResponse({ success: true });
                });
            });
            return true;

        case 'deleteList':
            chrome.storage.local.get('savedLists', (result) => {
                const savedLists = result.savedLists || [];
                const filteredLists = savedLists.filter(list => list.id !== request.listId);
                chrome.storage.local.set({ savedLists: filteredLists }, () => {
                    sendResponse({ success: true });
                });
            });
            return true;

        case 'clearAllData':
            chrome.storage.local.clear(() => {
                sendResponse({ success: true });
            });
            return true;

        default:
            sendResponse({ error: 'Unknown action' });
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // If popup is not configured, you can open a new tab with interface
    // chrome.tabs.create({ url: 'popup.html' });
});

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        // You can add logic for automatic scanning
        // or other actions when page loads
    }
});

// Handle tab closing
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    // Clean up data related to closed tab
});

// Periodic cleanup of old data (optional)
setInterval(() => {
    chrome.storage.local.get('savedLists', (result) => {
        const savedLists = result.savedLists || [];
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const filteredLists = savedLists.filter(list => {
            const listDate = new Date(list.createdAt);
            return listDate > thirtyDaysAgo;
        });
        
        if (filteredLists.length !== savedLists.length) {
            chrome.storage.local.set({ savedLists: filteredLists });
        }
    });
}, 24 * 60 * 60 * 1000); // Check once a day 