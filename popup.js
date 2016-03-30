chrome.browserAction.setBadgeText({text: "5"}); // We have 10+ unread items.
chrome.browserAction.setBadgeBackgroundColor({color: '#ffA400'});

document.addEventListener('DOMContentLoaded', function() {
    $(document).ready(function() {
        $("#getResult").click(function() {
            $.ajax({
	                url: "https://jira2.cerner.com/rest/api/2/search?jql=assignee%3D" + $("#username").val() + "%20and%20status!%3DClosed",
	                type: "GET",
	                dataType: "json",
	                async: true, 
	                success: handleData,
	                jsonp: false,
	                error: function (response) {
	                    $("#jira").text("error: " + response.responseText);
	                }
            });
        })
    });
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