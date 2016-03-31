function fetchGit() {

  console.log('fetchGit');
  var pullrequestCount=0;
  jQuery.ajax({
    type : 'GET',
    url : 'https://github.cerner.com/api/v3/users/DB029476/received_events?per_page=100',
    dataType : 'json',
    contentType : 'application/json',
    async : false,    
    success: function(response) {
      

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
      
      
      },error: function(obj,error,errormsg){
      // alert(obj.responseText);
      
    }
    });
  console.log(pullrequestCount);
  return pullrequestCount;
}