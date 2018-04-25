
// chrome.runtime.onMessage.addListener(function(request){
// 	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs) {
// 	    chrome.tabs.sendMessage(tabs[0].id, request);
// 	});
// }); 



chrome.runtime.onMessage.addListener(function(request){
	chrome.tabs.query({},function(tabs){     
	    tabs.forEach(function(tab) {
			console.log('for tabs');
			for (let i in request) {
				if (i === 'sort') continue;
				console.log('req ',i);
				if (tab.url.search(i) > -1) {
					console.log('send')
					console.log(request);
					chrome.tabs.sendMessage(tab.id, request);
				}
			}
	    });
	 });
});