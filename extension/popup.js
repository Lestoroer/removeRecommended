let site_name = 'youtube';

let populs = [];

let tabs = {
	dom:document.querySelector('#tab_view'),
	init:function () {
		this.dom.addEventListener('click', (e) => {
			this.event(e);
		});
	},
	setActive: function(name) {
		let last_content = document.querySelector('.active[content]');
		if (last_content) last_content.classList.remove('active');
		
		let current_content = document.querySelector(`[content="${name}"]`);
		if (current_content) current_content.classList.add('active');
	},
	event: function(e) {
		let current = e.target.closest('[tab]');
		if (!current) return;
		let last_tab = this.dom.querySelector('.active[tab]');
		if (last_tab) last_tab.classList.remove('active');
		current.classList.add('active');
		site_name = current.getAttribute('tab');
		this.setActive(site_name);
		let index = populs.indexOf(site_name);
		if (index > -1) {
			populs.unshift(populs.splice(index, 1)[0]);
		}
		switchers.data.sort = populs;
		chrome.storage.sync.set(switchers.data);
	},
	load: function() {
		let html = [];
		for (let i = 0; i < populs.length; i++) {
			html.push(`<div class="menu_item${i === 0 ? ' active' : ''}" tab="${populs[i]}">
				<svg class="${populs[i]}_menu">
				<use  xlink:href="#${populs[i]}_menu_icon"></use>
				</svg>
			</div>`);
		};
		this.dom.innerHTML = html.join('');
	}
}

tabs.init();

let switchers = {
	data:{
		'youtube':{
			mine_recommen:false,
			right:true,
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
	},
	dom: document.querySelectorAll('.checkbox'),
	init: function() {
		chrome.storage.sync.get((data) => {
			let header = document.querySelector('.header');
			if (data.login) {
				console.log('login', data.login);
				header.classList.add('logIn');
				let img = header.querySelector('.sign_in img');
				img.src = data.login.photo;
				let name = header.querySelector('[name]');
				name.innerHTML = data.login.name;//`${data.login.first_name} ${data.login.last_name}`;
			} else {
				header.classList.remove('logIn');
			}
			populs = Object.keys(this.data);
			if (data.sort && data.sort.length > 0) {
				populs = data.sort;
			}
			tabs.load();
			tabs.setActive(populs[0]);
			for (let i in this.data) {
				if (i === 'sort') continue;
				if (!data[i]) data[i] = this.data[i];
				this.data[i] = Object.assign(this.data[i], data[i] || {});			
				let dom = document.querySelector(`[content="${i}"]`);
				if (!dom) continue;
				for (let item in this.data[i]) {
					let check = dom.querySelector(`.checkbox[name="${item}"]`);
					if (!check) continue;
					let name = check.getAttribute('name');
					if (!name) continue;
					check.setAttribute('checked', this.data[i][item]);
					check.addEventListener('click', (e) => {this.event(e);});
				}	
			}
            updatePickCount();
		});
	},
	event: function(e) {
		let enable = e.target.getAttribute('checked');
		let name = e.target.getAttribute('name');
		if (!name) return;
		let current = !(enable === 'true');
		e.target.setAttribute('checked', current);
		let content = e.target.closest('[content]');
		if (!content) return console.log('err_1');
		let site_name = content.getAttribute('content');
		this.data[site_name][name] = current;
		chrome.storage.sync.set(this.data);

		chrome.runtime.sendMessage(this.data);
        updatePickCount();
	}
}

function exit() {
	chrome.storage.sync.get((data) => {
		delete data.login;
		console.log(data);
		chrome.storage.sync.remove(['login']);
		switchers.init();
	});
}

let items_classes = ['vk_items', 'fs_items'];

for (let i = 0; i < items_classes.length; i++) {
	let item_class = items_classes[i];
    js.listen(js.query(`.items.${item_class}`), 'click', (event) => {
        if (event.target.closest(`.${item_class}`)) {
            return js.toggleClass(document.querySelector(`.row_items_scroll.${item_class}`), 'showed');
        }
    });
}

function updatePickCount() {
    for (let i = 0; i < items_classes.length; i++) {
		let item_class = items_classes[i];
		let item = js.query(`.row_items_scroll.${item_class}`);
		let item_lenght = item.querySelectorAll('.checkbox[checked="true"]').length;
		let item_lenght_max = item.querySelectorAll('.checkbox').length;

		js.get(`#${item_class}_pick_count`).innerText = item_lenght;
		js.get(`#${item_class}_pick_count_max`).innerText = item_lenght_max;
    }
}

document.querySelector('.sign_in').addEventListener('click', exit);


switchers.init();