
var oldChromeVersion = !chrome.runtime;
var delay = 1;

if (oldChromeVersion) {
  onInit();
} else {
  chrome.runtime.onInstalled.addListener(onInit);
  chrome.alarms.onAlarm.addListener(onAlarm);
}

function onAlarm(alarm) {
  console.log('Got alarm', alarm);
  startRequest();
}

function onInit() {
  console.log('onInit');
  startRequest();
}

function scheduleRequest() {
  console.log('Scheduling for: ' + delay);

  console.log('Creating alarm');
    // Use a repeating alarm so that it fires again if there was a problem
    // setting the next alarm.
  chrome.alarms.create('refresh', {periodInMinutes: delay});
}

function startRequest(params) {
    scheduleRequest();
    var pullRequestCount=0;
    var count=fetchGit();
    console.log(count);
    pullRequestCount+= count;
    chrome.browserAction.setBadgeText({text: ""+pullRequestCount}); 
}
