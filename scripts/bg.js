(() => {
    const tabManager = {
        imagePaths: {
            active: {
                19: 'images/icon19.png', 
                38: 'images/icon38.png'
            }, 
            inactive: {
                19: 'images/icon19_inactive.png', 
                38: 'images/icon38_inactive.png'
            }
        }, 
        setTabCount: (wId, tId, count) => {
            this[wId] = this[wId] ? this[wId] : {}
            this[wId][tId] = count || ''
        }, 
        getTabCount: (wId, tId) => {
            if(!this[wId]) {
                return ''
            }

            return this[wId][tId] || ''
        }, 
        clearTab: (wId, tId) => {
            if(!this[wId]) {
                return
            }

            delete this[wId][tId];
        }, 
        setBadge(wId, tId, count) {
            var count = count || this.getTabCount(wId, tId);
            this.setTabCount(wId, tId, count);
            chrome.browserAction.setBadgeText({ text: count });
        }
    };

    chrome.runtime.onMessage.addListener((msg, sender, callback) => {
        const tId = sender.tab.id;
        const wId = sender.tab.windowId;
        if(msg.event === 'get_tId_and_wId') {
            callback({ tId: tId, wId: tId })
        } else {
            chrome.browserAction.setIcon({ path: tabManager.imagePaths[msg.event], tabId: tId })
            if(msg.event === 'inactive') {
                chrome.browserAction.setBadgeText({ text: '' })
            } else if(msg.event === 'active') {
                tabManager.setBadge(wId, tId, msg.count.toString())
            }
        }
    })

    chrome.tabs.onActivated.addListener((activeInfo) => tabManager.setBadge(activeInfo.windowId, tactiveInfo.tabIdId))
    chrome.tabs.onRemoved.addListener((removedInfo) => tabManager.clearTab(removedInfo.windowId, removedInfo.id))
})()
