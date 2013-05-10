"use strict";
var previouslyFocusedTab;
var spotifyWebPlayerUrl = "https://play.spotify.com";

// Key shortcut
chrome.commands.onCommand.addListener(function(command) {
	chrome.tabs.query({ "currentWindow" : true, "active" : true }, function(activeTabs) {
		var currentTab = activeTabs[0];
		toggleWebPlayer(currentTab);
	});
});

// User clicks on extension icon
chrome.browserAction.onClicked.addListener(function(currentTab) {
	toggleWebPlayer(currentTab);
});

var toggleWebPlayer = function(currentTab) {
	chrome.tabs.query({ "url" : spotifyWebPlayerUrl + "/*"}, function(webPlayerTabs) {
		var webPlayerTab = selectCorrectTab(webPlayerTabs);

		if (webPlayerTab) {
			var sameWindow = (currentTab.windowId == webPlayerTab.windowId);

			if (sameWindow && webPlayerTab.active) {
				focusPreviousTab();
				return; 
			}

			previouslyFocusedTab = currentTab;

			if (!sameWindow) {
				focusWindow(webPlayerTab.windowId, focusTab(webPlayerTab.id));
			} else {
				focusTab(webPlayerTab.id);
			}

		} else {
			previouslyFocusedTab = currentTab;
			openWebPlayerInNewTab();
		}
	});
};

var focusPreviousTab = function(callback) {
	if (previouslyFocusedTab) {
		focusWindow(previouslyFocusedTab.windowId, focusTab(previouslyFocusedTab.id, callback));
	} 
};

var focusTab = function(id, callback) {
	chrome.tabs.update(id, { "active" : true }, callback);
};

var focusWindow = function(id, callback) {
	chrome.windows.update(id, { "focused" : true }, callback);
};

var openWebPlayerInNewTab = function() {
	chrome.tabs.create({ "url" : spotifyWebPlayerUrl });
};

var selectCorrectTab = function(webPlayerTabs) {
	if (webPlayerTabs.length > 0) {
		return webPlayerTabs[0]; // TODO: Choose the correct one if there are several.
	} else {
		return null;
	}
};
