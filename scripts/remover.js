(() => {
    let currentUrl = {}
    const constants = {
        queries: {
            result_links: 'div.g:not([style*="display:none"]):not([style*="display: none"]) .r > a[href*="www.pinterest.com"]', 
            link_parent_node: '#rso div.g', 
            main_google_node: 'main'
        }, 
        events: {
            get_info: 'get_tId_and_wId', 
            inactive: 'inactive', 
            active: 'active'
        }, 
        observerConfig: { childList: true, subtree: true }
    }
    const init = () => {
        let mainGoogleNode = document.getElementById(this.constants.queries.main_google_node)
        if(!mainGoogleNode) {
            return chrome.runtime.sendMessage({ event: this.constants.events.inactive, url: window.location.href })
        } 
        chrome.runtime.sendMessage({ event: this.constants.events.get_info }, (info) => {
            const wId = info.wId
            this.currentUrl[wId] = this.currentUrl[wId] ? this.currentUrl[wId] : {}
            this.currentUrl[wId][info.tId] = window.location.href
            this.remove(info)
            this.createResultsObserver(mainGoogleNode)
        })
    }

    const getSpamLinks = () => document.querySelectorAll(this.constants.queries.result_links)
    const isSameUrl = (currentUrl, info) => currentUrl === this.currentUrl[info.wId][info.tId]

    const remove = (info) => {
        const tId = info.tId
        const wId = info.wId
        const links = this.getSpamLinks()
        if(!links.length) {
            if(!this.isSameUrl(window.location.href, info)) {
                chrome.runtime.sendMessage({ event: this.constants.events.inactive })
                this.currentUrl[wId][tId] = window.location.href
            }
            return
        }
        this.currentUrl[wId][tId] = window.location.href
        chrome.runtime.sendMessage({ event: this.constants.events.active, count: links.length })
        links.forEach(this.deleteOldGrandpaNode.bind(this))
    }

    const createResultsObserver = () => {
        this.resultsObserver = new MutationObserver(() => {
            chrome.runtime.sendMessage({ event: this.constants.events.get_info }, info => {
                this.currentUrl[info.wId] = this.currentUrl[wId] ? this.currentUrl[wId] : {}
                this.remove(info)
            })
        })
        this.resultsObserver.observe(mainGoogleNode, this.constants.observerConfig)
    }

    const deleteOldGrandpaNode = () => {
        let parent = el.closest(this.constants.queries.link_parent_node)
        if(parent) {
            parent.style.display = 'none'
        }
    }

   this.init()
})()

