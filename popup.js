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
  fetchReviews();
};

function updateCount(count){
	chrome.browserAction.setBadgeText({text: ""+count}); 
}

function fetchReviews() {
	var reviewCount=0;
  jQuery.ajax({
    type : 'GET',
    url : 'http://crucible1.cerner.com/viewer/rest-service/reviews-v1/filter?reviewer=ma026973&complete=false&states=Review',
    dataType : 'json',
    contentType : 'application/json',
    success: function(response) {
	  var reviewData=response.reviewData
      var reviewsList=[];
      if ( jQuery.isArray(reviewData) ) {
      
      $.each(reviewData, function(i, event) {
		  var review = event.permaId;
		  var reviewName = event.name;
          var reviewId=review.id;
          reviewsList.push("<a href=http://crucible1.cerner.com/viewer/cru/"+reviewId+"> "+reviewId+"("+reviewName+")</a>");
            reviewCount++;

      });
      } else {
        alert('Not array');
      }
      $("#crucibleReviewCount").html(reviewCount);
     updateCount(reviewCount);
      var reviewElement="<ul>";
      $.each(reviewsList, function(i, reviewId) {
        reviewElement+="<li>"+reviewId+"</li>";
      });
      reviewElement+="</ul>";
      $("#crucibleReviews").html(reviewElement);
      },error: function(obj,error,errormsg){
      alert(obj.responseText);
      
    }
    });
	return reviewCount;
}
