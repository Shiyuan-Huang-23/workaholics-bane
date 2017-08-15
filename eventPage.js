/*This is the script for the extension's event page.
*It listens for tab updates, and redirects users to the default page when they try to go to another website.
*It listens for when the active tab is switched, and redirects users to the default page when they switch into a blacklisted active tab
*/

var blocking = false;

// checks if the tab is the active tab in the current window
var queryInfo = {active: true, lastFocusedWindow: true};
// url for default page
var resetProp = {url: "chrome://extensions/"};

function redirect() {
	// applies only to the current tab
	chrome.tabs.query(queryInfo, function(tabs) {
		// redirects user if they're not on the default screen
		if (blocking) {
			if (tabs[0].url != resetProp.url) {
				chrome.tabs.update(resetProp)
			}
		}
	});
}

// redirects user as soon as a tab updates
chrome.tabs.onUpdated.addListener(function() {
	redirect();
});

// redirects user as soon as they switch tabs
chrome.tabs.onActivated.addListener(function() {
	console.log("Blocking: " + blocking);
	redirect();
});

// switches blocking when the alarm goes off
chrome.alarms.onAlarm.addListener(function(alarm) {
	if (!blocking) {
		blocking = true;
		// opens new tab
		chrome.tabs.create(resetProp);
	} else {
		blocking = false;
		// opens new tab
		chrome.tabs.create({url: "https://www.google.com/"});
		// clears all alamrs
		chrome.alarms.clearAll();
	}
});


