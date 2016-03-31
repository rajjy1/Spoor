document.addEventListener('DOMContentLoaded', function () {
    PopulateGIT();
    PopulateJIRA();
    fetchCrucibleReviews();

    function PopulateGIT() {
        jQuery.ajax({
            type: 'GET',
            url: 'https://github.cerner.com/api/v3/users/DB029476/received_events?per_page=100',
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
        if (jQuery.isArray(data)) {
            $.each(data, function (i, event) {
                var eventType = event.type;
                if (eventType == "PullRequestEvent") {
                    var payload = event.payload;
                    if (payload.action == "opened") {
                        cList1 += " <li><a href=" + payload.pull_request.html_url + " target='_blank'>" + payload.pull_request.html_url + " </a></li>";
                    }
                }
            });
        }
        cList1 += " </ul>"
        $("#github").html(cList1);
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
        $.each(data.issues, function (key, val) {
            link = "https://jira2.cerner.com/browse/" + val.key;
            cList += " <li><a href=" + link + " target='_blank'>" + val.fields.summary + " </a></li>";
        });
        cList += " </ul>"
        $("#jira").html(cList);
    }


    function fetchCrucibleReviews() {
        console.log("fcr");
        count = 0;
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
                //updateCount(reviewCount);
                var reviewElement = "<ul>";
                $.each(reviewsList, function (i, reviewId) {
                    reviewElement += "<li>" + reviewId + "</li>";
                });
                reviewElement += "</ul>";
                if (flag) {
                    console.log(reviewElement);
                    //$("#crucibleOutForReviewCount").html(reviewCount);
                    $("#crucible").html(reviewElement);
                } else {

                    console.log("else: " + reviewElement);
                    //$("#crucibleToReviewCount").html(reviewCount);
                    $("#jira3").html(reviewElement);
                }
            }, error: function (obj, error, errormsg) {
                console.log(obj.responseText);
            }
        });
        return reviewCount;
    }
}, false);