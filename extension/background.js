
// chrome.runtime.onMessage.addListener(function(request){
// 	chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function(tabs) {
// 	    chrome.tabs.sendMessage(tabs[0].id, request);
// 	});
// }); 

let def = {
	'youtube':{
		mine:false,
		right:false,
		comment:true,
		playlist:true,
		tranding:false,
		videowall:false
	},
	'vk.com': {
		vk_history:true,
		vk_people_you_may_know:true,
		vk_ads:false,
		vk_menu_myprofile: true,
		vk_menu_news: true,
		vk_menu_messages: true,
		vk_menu_friends: true,
		vk_menu_communities: true,
		vk_menu_photos: true,
		vk_menu_music: true,
		vk_menu_videos: true,
		vk_menu_games: true,
		vk_menu_market: true,
		vk_menu_bookmarks: true,
		vk_menu_documents: true,
		vk_menu_ads: true,
	},
	'facebook': {
		fb_people_you_may_know:true,
		fb_menu_news_feed: true,
		fb_menu_items_messenger: true,
		fb_menu_groups: true,
		fb_menu_pages: true,
		fb_menu_events: true,
		fb_menu_friend_lists: true,
		fb_menu_on_this_day: true,
		fb_menu_pages_feed: true,
		fb_menu_photos: true,
		fb_menu_find_friends: true,
		fb_menu_games: true,
		// fb_menu_suggest_edits: true,
		fb_menu_offers: true,
		fb_menu_live_video: true,
		fb_menu_payment_history: true,
		fb_menu_gaming_video: true,
		fb_menu_buy_and_sell_groups: true,
		fb_menu_create_a_frame: true,
		fb_menu_discover_people: true,
		fb_menu_crisis_response: true,
		fb_menu_recommendations: true,
		fb_menu_recent_ad_activity: true,
		fb_menu_saved: true,
		fb_menu_weather: true,
		fb_menu_create_a_frame: true,
		fb_menu_manage_apps: true,
		fb_menu_insights: true,
	}
};

chrome.storage.sync.get((user_data) => {
	let data = {};
	for (let i in def) {
		if (!user_data[i]) user_data[i] = def[i];
		data[i] = user_data[i];
	}
	chrome.storage.sync.set(data);
})

chrome.runtime.onMessage.addListener(function(request){
	chrome.tabs.query({},function(tabs){     
	    tabs.forEach(function(tab) {
			for (let i in request) {
				if (i === 'sort' || i === 'login') continue;
				if (tab.url.search(i) > -1) {
					chrome.tabs.sendMessage(tab.id, request);
				}
			}
	    });
	 });
});