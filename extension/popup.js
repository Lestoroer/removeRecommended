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
		
		let current_content = document.querySelector(`[content="${name}"]`)
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
			console.log(populs);
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
			vk_menu:true
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
			if (data.sort) {
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
		console.log(this.data);
		chrome.runtime.sendMessage(this.data);
	}
}
document.getElementById("items_container").addEventListener('click', function(){
	this.classList.toggle("showed")
});
switchers.init();