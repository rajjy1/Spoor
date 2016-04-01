cernerUsername = $.cookie('cenrerusername');
jenkinsViewName = $.cookie('jenkViewName');

document.addEventListener('DOMContentLoaded', function () {
    console.log("cookie username:" + $.cookie('cernerusername'));
    if (cernerUsername == null || cernerUsername == "") {
        SetUnAvailableStatus();
    } else {
        fetchData();
    }
    DisplayInput();
    RegisterInputEvents();
}, false);

function PopulateGIT() {
    jQuery.ajax({
        type: 'GET',
        url: 'https://github.cerner.com/api/v3/users/' + cernerUsername + '/received_events?per_page=300',
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
    if (data.message == "Not Found") {
        return;
    }
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
    $("#requests").text(gitCount + " git pull requests");
    updateCount(gitCount);
}

function fetchCount() {
    fetchData();
}

function SetUnAvailableStatus() {
    $("#jiras").text("UnAvailable");
    $("#reviews").text("UnAvailable");
    $("#failed").text("UnAvailable");
    $("#requests").text("UnAvailable");
}

function fetchData() {
    count = 0;
    PopulateGIT();
    fetchJira();
    fetchCrucibleReviews();
    if (jenkinsViewName == null || jenkinsViewName == "") {
        $("#failed").text("UnAvailable");
    }
    else {
        fetchJenkinsJobs();
    }
}

function fetchJira()
{
    jiraCount = 0;
    var jiraUrls = ['https://jira1.cerner.com/',
                        'https://jira2.cerner.com/',
                        'https://jira3.cerner.com/']

    $.each(jiraUrls, function (i, jiraUrl) {
        populateJIRA(jiraUrl);
    });
}
function populateJIRA(jiraServerUrl) {
    var jiraApiUrl = jiraServerUrl + "rest/api/2/search?jql=assignee%3D" + cernerUsername + "%20and%20status!%3DClosed";
    $.ajax({
        url: jiraApiUrl,
        type: "GET",
        dataType: "json",
        async: true,
        success: function (data) {
            var cList = "<ul> ";
            var link = "";
            var giraCount = 0;
            $.each(data.issues, function (key, val) 
            {
                link = jiraServerUrl + 'browse/' + val.key;
                cList += " <li class='testli'><a href=" + link + " target='_blank'>" + val.key + '&nbsp:&nbsp' + val.fields.summary + " </a></li>";
                giraCount++;
            });

            cList += " </ul>"
            $("#jira").html(cList);
            updateJiraCount(giraCount);
        },
        jsonp: false,
        error: function (response) {
            $("#jira").text("An error was encountered.");
        }
    });
}

function updateJiraCount(cnt)
{
    jiraCount += cnt;
    $("#jiras").text(jiraCount + " outstanding jiras");
    updateCount(cnt);

}

function fetchCrucibleReviews() {
    toReviewElement = "<li class='crucibleHeader'>To Review:</li>";
    outReviewElement = "<li class='crucibleHeader'>Out For Review:</li>";
    totalCrucibleCount = 0;
    var crucibleUrls = ['http://crucible01.cerner.com/',
                        'http://crucible02.cerner.com/viewer/',
                        'http://crucible03.cerner.com/viewer/']

    $.each(crucibleUrls, function (i, crucibleUrl) {
        fetchReviews(crucibleUrl, true);
            });

    $.each(crucibleUrls, function (i, crucibleUrl) {
        fetchReviews(crucibleUrl, false);
            });
    return count;
};

function updateCount(cnt) {
    count += cnt;
    if (count > 0) {
        chrome.browserAction.setBadgeText({ text: count.toString() });
    } else {
        chrome.browserAction.setBadgeText({ text: "" });
    }
}

function updateCrucibleContent(flag, review){
    if (flag) {
        outReviewElement += review;      
    } else {
        toReviewElement += review;
    }
    $("#crucible").html(toReviewElement +"<li class='crucibleHeaderBlank'></li>"+ outReviewElement);
}

function fetchReviews(apiUrl, flag) {
    var reviewCount = 0;
    var queryUrl = ""
    if (flag)
    {
        queryUrl = apiUrl + 'rest-service/reviews-v1/filter?author='+ cernerUsername + '&moderator=' + cernerUsername + '&creator=' + cernerUsername + '&orRoles=true&complete=false&states=Review'
    }
    else
    {
        queryUrl = apiUrl + 'rest-service/reviews-v1/filter?reviewer=' + cernerUsername + '&complete=false&states=Review'
    }
    jQuery.ajax({
        type: 'GET',
        url: queryUrl,
        dataType: 'json',
        jsonp: false,
        contentType: 'application/json',
        success: function (response) {
            console.log("crucible success");
            console.log(response.code);
            if (response.code == "NotFound") {
                return;
            }
            console.log(response.responseText);
            var reviewData = response.reviewData
            var reviewsList = [];
            if (jQuery.isArray(reviewData)) {
                $.each(reviewData, function (i, event) {
                    var review = event.permaId;
                    var reviewName = event.name;
                    var reviewId = review.id;
                    reviewsList.push("<a href=" + apiUrl + "cru/" + reviewId + " target='_blank' > " + reviewId + "&nbsp;:&nbsp;" + reviewName + "</a>");
                    reviewCount++;
                });
            } else {
                console.log('Not array');
            }

            var reviewElement = "";

            
            updateCount(reviewCount);
            totalCrucibleCount += reviewCount;

            $("#reviews").text(totalCrucibleCount + " outstanding reviews");

            reviewElement += "<ul>";
            $.each(reviewsList, function (i, reviewId) {
                reviewElement += "<li>" + reviewId + "</li>";
            });
            reviewElement += "</ul>";
            updateCrucibleContent(flag, reviewElement);
        },
        error: function (error) {
            console.log("crucible error");
            console.log(error.code);
            //console.log(obj.responseText);
        }
    });
    return reviewCount;
}

function fetchJenkinsJobs() {
    var reviewCount = 0;
    console.log(jenkinsViewName + '/api/json');
    jQuery.ajax({
        type: 'GET',
        url: jenkinsViewName + '/api/json',
        dataType: 'json',
        jsonp: false,
        contentType: 'application/json',
        success: function (response) {
            var reviewData = response.jobs
            var jobsList = [];
            if (jQuery.isArray(reviewData)) {

                $.each(reviewData, function (i, event) {

                    var jobstate = event.color;

                    if (jobstate == 'red') {
                        var jobname = event.name;
                        var url = event.url;
                        var jobentry = '<a href=' + url + ' target="_blank">' + jobname + '</a>';
                        jobsList.push(jobentry);
                        reviewCount++;
                    }

                });
            } else {
                //alert('Not array');
            }
            updateCount(reviewCount);
            var reviewElement = "<ul>";
            $.each(jobsList, function (i, reviewId) {
                reviewElement += "<li>" + reviewId + "</li>";
            });
            reviewElement += "</ul>";
            $("#jenkins").html(reviewElement);
            $("#failed").text(reviewCount + " builds failed");
        }, error: function (obj, error, errormsg) {
           // alert(obj.responseText);

        }
    });
    return reviewCount;
}

/**Cookies */

function DisplayInput() {
    console.log("in here");
    $("#spoor").html("<div id='username-input'> <input type='text' id='username' placeholder='username' /> <label id = 'savedUser'> </label> <br /> <button id='changeUser'> Switch User </button> <button id='saveUser'> Save User </button> </div>       <br /><br />         <div id='viewname-input'> <input type='text' id='viewName' placeholder='view name' /> <label id = 'savedViewName'> </label> <br /> <button id='changeViewName'> Switch View Name </button> <button id='saveViewName'> Save View Name </button> </div>");
    console.log("username:" + cernerUsername);
    if (cernerUsername == null || cernerUsername == "") {
        console.log("null");
        $("#savedUser").hide();
        $("#changeUser").hide();
    } else {
        $("#savedUser").text(cernerUsername);
        console.log("not null");
        $("#username").hide();
        $("#saveUser").hide();
    }

    if (jenkinsViewName == null || jenkinsViewName == "") {
        console.log("null");
        $("#savedViewName").hide();
        $("#changeViewName").hide();
    } else {
        $("#savedViewName").text(jenkinsViewName);
        console.log("not null");
        $("#viewName").hide();
        $("#saveViewName").hide();
    }
}

function RegisterInputEvents() {
    /* username events */
    $("#username").click(function (event) {
        console.log($.cookie('cenrerusername'));
        event.stopPropagation();
        return false;
    })

    $("#saveUser").click(function (event) {
        var input = $("#username").val();
        SetCookie('cenrerusername', $("#username").val());
        cernerUsername = $.cookie('cenrerusername');
        console.log(cernerUsername);
        $("#username").hide();
        $("#saveUser").hide();
        $("#savedUser").text(cernerUsername);
        $("#savedUser").show();
        $("#changeUser").show();
        fetchData();
    })

    $("#changeUser").click(function (event) {
        event.stopPropagation();
        SetCookie('cenrerusername', "");
        cernerUsername = "";
        $("#username").show();
        $("#saveUser").show();
        $("#savedUser").text("");
        $("#savedUser").hide();
        $("#changeUser").hide();
        fetchData();
    })
    /* username events */


    /* viewName events*/

    $("#viewName").click(function (event) {
        console.log($.cookie('jenkViewName'));
        event.stopPropagation();
        return false;
    })

    $("#saveViewName").click(function (event) {
        var input = $("#viewName").val();
        SetCookie('jenkViewName', $("#viewName").val());
        jenkinsViewName = $.cookie('jenkViewName');
        console.log(jenkinsViewName);
        $("#viewName").hide();
        $("#saveViewName").hide();
        $("#savedViewName").text(jenkinsViewName);
        $("#savedViewName").show();
        $("#changeViewName").show();
        fetchData();
    })

    $("#changeViewName").click(function (event) {
        event.stopPropagation();
        SetCookie('jenkViewName', "");
        jenkinsViewName = "";
        $("#viewName").show();
        $("#saveViewName").show();
        $("#savedViewName").text("");
        $("#savedViewName").hide();
        $("#changeViewName").hide();
        fetchData();
    })
    /* viewName events*/
}

function SetCookie(name, value) {
    $.cookie(name, value, { expires: 7, path: '/' });
}

/**Cookies */
