
// chrome.runtime.onMessage.addListener(function(request){
// 	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs) {
// 	    chrome.tabs.sendMessage(tabs[0].id, request);
// 	});
// }); 



chrome.runtime.onMessage.addListener(function(request){
	chrome.tabs.query({},function(tabs){     
	    tabs.forEach(function(tab) {
			for (let i in request) {
				if (i === 'sort') continue;
				if (tab.url.search(i) > -1) {
					chrome.tabs.sendMessage(tab.id, request);
				}
			}
	    });
	 });
});