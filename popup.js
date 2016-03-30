chrome.browserAction.setBadgeText({text: "5"}); // We have 10+ unread items.
chrome.browserAction.setBadgeBackgroundColor({color: '#ffA400'});

document.addEventListener('DOMContentLoaded', function() {
    $(document).ready(function () {
       // $("#jira1").text($.cookie('cerner-username'));
        if ($.cookie('cerner-username') == null) {
            $("#username-input").show();
            $("#jira-display").hide();
        }
        else {
            $("#username-input").hide();
            $("#jira-display").show();
            PopulateJIRA();
        }
        $("#saveUserName").click(function () {
            $("#username-input").hide();
            $.cookie('cerner-username', $("#username").val(), { expires: 7, path: '/' });
            PopulateJIRA();
            $("#jira-display").show();
        })
        $("#forget-user").click(function () {
            $.removeCookie('cerner-username');
            $("#username-input").show();
            $("#jira-display").hide();
        });
    });

    function PopulateJIRA() {
        var username = $.cookie('cerner-username');
        $.ajax({
            url: "https://jira2.cerner.com/rest/api/2/search?jql=assignee%3D" + username + "%20and%20status!%3DClosed",
            type: "GET",
            dataType: "json",
            async: true,
            success: handleData,
            jsonp: false,
            error: function (response) {
                $("#jira").text("error: " + response.responseText);
            }
        });
    }

    function handleData(data) {
	    var cList = "";
	    var link = "";
	    $.each(data.issues, function (key, val) {
	        link = "https://jira2.cerner.com/browse/" + val.key;
	        cList += " <li><a href=" + link + " target='_blank'>" + val.fields.summary + " </a></li>";
	    });
	    $("#jira").html(cList);
	}
}, false);