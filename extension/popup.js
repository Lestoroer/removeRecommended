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
	data:{},
	dom: document.querySelectorAll('.checkbox'),
	init: function() {
		chrome.storage.sync.get((data) => {
			this.data = data;
			let header = document.querySelector('.header');
			if (data.login) {
				header.classList.add('logIn');
				let img = header.querySelector('.sign_in img');
				img.src = data.login.photo;
				let name = header.querySelector('[name]');
				name.innerHTML = data.login.name;//`${data.login.first_name} ${data.login.last_name}`;
			} else {
				header.classList.remove('logIn');
			}

			populs = Object.keys(data);

			if (data.sort && data.sort.length > 0) {
				populs = data.sort;
			} else populs = data.sort = ['youtube','facebook','vk.com'];
			
			tabs.load();
			tabs.setActive(populs[0]);
			for (let i in data) {
				if (i === 'sort') continue;
				let dom = document.querySelector(`[content="${i}"]`);
				if (!dom) continue;
				for (let item in this.data[i]) {
					let check = dom.querySelector(`.checkbox[name="${item}"]`);
					if (!check) continue;
					let name = check.getAttribute('name');
					if (!name) continue;
					check.setAttribute('checked', data[i][item]);
					check.addEventListener('click', (e) => {this.event(e);});
				}	
			}
			chrome.storage.sync.set(data);
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
		if (!content) return;
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

js.get('#login_exit').addEventListener('click', exit);

//for listening any message which comes from runtime
chrome.runtime.onMessage.addListener(function(msg) {
});

switchers.init();