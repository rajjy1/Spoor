// chrome.browserAction.setBadgeText({text: "5"}); // We have 10+ unread items.
chrome.browserAction.setBadgeBackgroundColor({color: '#ffA400'});
document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = document.getElementById('checkPage');
  checkPageButton.addEventListener('click', function() {

    chrome.tabs.getSelected(null, function(tab) {
      d = document;

      var f = d.createElement('form');
      f.action = 'http://gtmetrix.com/analyze.html?bm';
      f.method = 'post';
      var i = d.createElement('input');
      i.type = 'hidden';
      i.name = 'url';
      i.value = tab.url;
      f.appendChild(i);
      d.body.appendChild(f);
      f.submit();
    });
  }, false);
}, false);


window.onload = function() {
  fetchGit();
};

function fetchGit() {
  jQuery.ajax({
    type : 'GET',
    url : 'https://github.cerner.com/api/v3/users/DB029476/received_events?per_page=100',
    dataType : 'json',
    contentType : 'application/json',
    async : false,    
    success: function(response) {
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
        alert('Not array');
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
      alert(obj.responseText);
      
    }
    });
}