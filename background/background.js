
var oldChromeVersion = !chrome.runtime;
var delay = 5;

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
  fetchGit();
  scheduleRequest();
}

function fetchGit() {
  console.log('FetchGit');
  jQuery.ajax({
    type : 'GET',
    url : 'https://github.cerner.com/api/v3/users/DB029476/received_events?per_page=100',
    dataType : 'json',
    contentType : 'application/json',
    async : false,    
    success: function(response) {
        console.log(response);
      var pullrequestCount=0;

      var pullRequestList=[];
      if ( jQuery.isArray(response) ) {
      
      $.each(response, function(i, event) {
       var eventType=event.type;
       if(eventType=="PullRequestEvent"){
          var payload=event.payload;
          if(payload.action=="opened"){
            var pullrequest=payload.pull_request;
            pullRequestList.push(pullrequest.html_url);
            pullrequestCount++;
          }
        }
      });
      } else {
        // alert('Not array');
      }
      $("#githubCount").html(pullrequestCount);
      chrome.browserAction.setBadgeText({text: ""+pullrequestCount}); 
      var pullRequestElement="<ul>";
      $.each(pullRequestList, function(i, pullRequest) {
        pullRequestElement+="<li>"+"<a href="+pullRequest+">"+pullRequest+"</a>"+"</li>";
      });
      pullRequestElement+="</ul>";
      $("#githubRequests").html(pullRequestElement);
      },error: function(obj,error,errormsg){
      console.log('Error');
      
    }
    });
}
