document.addEventListener('DOMContentLoaded', function () {
	fetchData();
}, false);

function PopulateGIT() {
    jQuery.ajax({
        type: 'GET',
        url: 'https://github.cerner.com/api/v3/users/DB029476/received_events?per_page=300',
        dataType: 'json',
        async: true,
        contentType: 'application/json',
        success: handleGITData,
        jsonp: false,
        error: function (obj, error, errormsg) {
            // alert(obj.responseText);
        }
    });
}

function handleGITData(data) {
    var cList1 = "<ul> ";
    var link1 = "";
    var gitCount = 0;
    if (jQuery.isArray(data)) {
        $.each(data, function (i, event) {
            var eventType = event.type;
            if (eventType == "PullRequestEvent") {
                var payload = event.payload;
                if (payload.action == "opened") {
                    cList1 += " <li><a href=" + payload.pull_request.html_url + " target='_blank'>" + payload.pull_request.html_url + " </a></li>";
                    gitCount++;
                }
            }
        });
    }
    cList1 += " </ul>"
    $("#github").html(cList1);
    updateCount(gitCount);
}

function fetchCount(){
	fetchData();
}

function fetchData(){
	count =0;
	PopulateGIT();
	PopulateJIRA();
	fetchCrucibleReviews();

}

function PopulateJIRA() {
    $.ajax({
        url: "https://jira2.cerner.com/rest/api/2/search?jql=assignee%3D" + "rk030967" + "%20and%20status!%3DClosed",
        type: "GET",
        dataType: "json",
        async: true,
        success: handleJIRAData,
        jsonp: false,
        error: function(response) {
            $("#jira").text("error: " + response.responseText);
        }
    });
}

function handleJIRAData(data) {
    var cList = "<ul> ";
    var link = "";
    var giraCount = 0;
    $.each(data.issues, function (key, val) {
        link = "https://jira2.cerner.com/browse/" + val.key;
        cList += " <li><a href=" + link + " target='_blank'>" + val.fields.summary + " </a></li>";
        giraCount++;
    });
    cList += " </ul>"
    $("#jira").html(cList);
    updateCount(giraCount);
}


function fetchCrucibleReviews() {
    console.log("fcr");
    content = "";
    var url1 = 'http://crucible1.cerner.com/viewer/rest-service/reviews-v1/filter?reviewer=ps031554&moderator=ps031554&creator=ps031554&orRoles=true&complete=false&states=Review';
    fetchReviews(url1, true);
    var url2 = 'http://crucible1.cerner.com/viewer/rest-service/reviews-v1/filter?reviewer=rk030967&complete=false&states=Review';
    fetchReviews(url2, false);
    return count;
};

function updateCount(cnt) {
    count += cnt;
    chrome.browserAction.setBadgeText({ text: "" + count });
}

function updateCrucibleContent(review){
	content +=  review;
	$("#crucible").html(content);
}

function fetchReviews(apiUrl, flag) {
    console.log("fr");
    var reviewCount = 0;
    jQuery.ajax({
        type: 'GET',
        url: apiUrl,
        dataType: 'json',
        jsonp: false,
        contentType: 'application/json',
        success: function (response) {
            var reviewData = response.reviewData
            var reviewsList = [];
            if (jQuery.isArray(reviewData)) {

                $.each(reviewData, function (i, event) {
                    var review = event.permaId;
                    var reviewName = event.name;
                    var reviewId = review.id;
                    reviewsList.push("<a href=http://crucible1.cerner.com/viewer/cru/" + reviewId + "> " + reviewId + "(" + reviewName + ")</a>");
                    reviewCount++;

                });
            } else {
                console.log('Not array');
            }
            
            var reviewElement = "";

            if (flag) {
            	reviewElement += "To Review:";	    
            } else {
                reviewElement += "Out For Review:";
            }
            updateCount(reviewCount);
            reviewElement += "<ul>";
            $.each(reviewsList, function (i, reviewId) {
                reviewElement += "<li>" + reviewId + "</li>";
            });
            reviewElement += "</ul>";
            updateCrucibleContent(reviewElement);
        }, error: function (obj, error, errormsg) {
            console.log(obj.responseText);
        }
    });
    return reviewCount;
}