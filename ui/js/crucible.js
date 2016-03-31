function fetchCrucibleReviews() {
  count = 0;
  var url1 = 'http://crucible1.cerner.com/viewer/rest-service/reviews-v1/filter?reviewer=ps031554&moderator=ps031554&creator=ps031554&orRoles=true&complete=false&states=Review';
  fetchReviews(url1,true);
  var url2 = 'http://crucible1.cerner.com/viewer/rest-service/reviews-v1/filter?reviewer=rk030967&complete=false&states=Review';
  fetchReviews(url2,false);
  return count;
};

function updateCount(cnt){
  count += cnt;
  chrome.browserAction.setBadgeText({text: ""+count}); 
}

function fetchReviews(apiUrl,flag) {
  var reviewCount=0;
  jQuery.ajax({
    type : 'GET',
    url : apiUrl,
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
      
     updateCount(reviewCount);
      var reviewElement="<ul>";
      $.each(reviewsList, function(i, reviewId) {
        reviewElement+="<li>"+reviewId+"</li>";
      });
      reviewElement+="</ul>";
    if(flag){
    //$("#crucibleOutForReviewCount").html(reviewCount);
    //$("#crucibleOutForReview").html(reviewElement);
    }else{
    //$("#crucibleToReviewCount").html(reviewCount);
    //$("#crucibleToReview").html(reviewElement);
    }
      },error: function(obj,error,errormsg){
      alert(obj.responseText);
      
    }
    });
  return reviewCount;
}