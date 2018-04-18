
// chrome.runtime.onMessage.addListener(function(request){
// 	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs) {
// 	    chrome.tabs.sendMessage(tabs[0].id, request);
// 	});
// }); 



chrome.runtime.onMessage.addListener(function(request){
	chrome.tabs.query({},function(tabs){     
	    tabs.forEach(function(tab){
	    	if (tab.url.search('youtube.com') > -1 || 
	    		tab.url.search('vk.com') > -1) {
	    		console.log(request);
	    		chrome.tabs.sendMessage(tab.id, request);
	    	}
	    });
	 });
});