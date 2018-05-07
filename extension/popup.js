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
			mine:true,
			mine_recommen:true,
			right:true,
			comment:false,
			playlist:false,
			tranding:true,
			videowall:true
		},
		'vk.com': {
			vk_history:true,
			vk_people_you_may_know:true,
			vk_ads:true,
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
		},
		'facebook': {
			fb_people_you_may_know:true,
			fb_did_you_know:true
		}
	},
	dom: document.querySelectorAll('.checkbox'),
	init: function() {
		chrome.storage.sync.get((data) => {
			console.log(data, 12);
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

let items_classes = ['.vk_items', '.fs_items'];

for (let i = 0; i < items_classes.length; i++) {
	let item_class = items_classes[i];
    js.listen(js.query(`.items${item_class}`), 'click', (event) => {
        if (event.target.closest(`${item_class}`)) {
            return js.toggleClass(document.querySelector(`.row_items_scroll${item_class}`), 'showed');
        }
    });
}

let items_pick_classes = ['.vk_items', '.fs_items'];

function updatePickCount() {

    // for (let i = 0; i < items_pick_classes.length; i++) {
    //     let item_class = items_classes[i];
    //     js.listen(js.query(`.items${item_class}`), 'click', (event) => {
    //         if (event.target.closest(`${item_class}`)) {
    //             return js.toggleClass(document.querySelector(`.row_items_scroll${item_class}`), 'showed');
    //         }
    //     });
    // }
    //
    // let dom_vk_menu_pick_count = document.getElementById('vk_menu_pick_count');
    // let checkbox_picked = document.getElementsByClassName('vk_items')[0].querySelectorAll('.checkbox[checked="true"]');
    // dom_vk_menu_pick_count.innerText = checkbox_picked.length;
}

// js.listen(js.queryAll('.items.superclass_space'), 'click', (event) => {
// 	console.log(event.target);
//     if (event.target.closest('.vk_items')) {
//     	console.log(document.querySelector('.row_items_scroll.vk_items'));
//         return js.toggleClass(document.querySelector('.row_items_scroll.vk_items'), 'showed');
//     }
//
//     if (event.target.closest('.fs_items')) {
//         return document.querySelector('.row_items_scroll.fs_items').toggle("showed");
//     }
// });




switchers.init();