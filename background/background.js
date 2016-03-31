SPOOR_APP = {
    id    : 1007,

};

SPOOR_API = {
    token   : null,
    user_id : null,

    getJiraInfo          : 'https://url_for_jira/',
    getCrucicbleInfo : 'https://url_for_crucible/'
};



function getNotifications() {
    console.log('getNotifications()');

}

function setBadgeCount(count) {
    console.log('setBadgeCount');
    if (count === '0') {
        count = '';
    }

    chrome.browserAction.setBadgeText({
        text : count
    });
}

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    sendResponse({
        messages : 'a new message has arrived',
        userId   : 'user_id'
    });
});

//ready, set, go!
init();