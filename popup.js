let site_name = 'youtube';

let tabs = {
	dom:document.querySelectorAll('.menu_item'),
	init:function () {
		for (let i = 0; i < this.dom.length; i++) {
			this.dom[i].addEventListener('click', (e) => {
				this.event(e);
			});
		}
	},
	event: function(e) {
		let current_button = e.target.closest('.menu_item');
		let index = -1;
		for (let i = 0; i < this.dom.length; i++) {
			if (this.dom[i] == current_button) {
				this.dom[i].classList.add('active');
				index = i;
			} else this.dom[i].classList.remove('active');
		}
		let tabs = document.querySelectorAll('.wrapper_youtube[content]');
		for (let i = 0; i < tabs.length; i++) {
			if (i === index) {
				tabs[i].classList.add('active');
			} else tabs[i].classList.remove('active');
		}
	}
}

tabs.init()

let switchers = {
	data:{
		'youtube':{
			mine:true,
			mine_recommen:true,
			right:true,
			comment:true,
			playList:true,
			tranding:true,
			videowall:true
		},
		'vk.com': {

		},
		'facebook': {

		}
	},
	dom: document.querySelectorAll('.checkbox'),
	init: function() {
		chrome.storage.sync.get((data) => {
			console.log(data, 12);
			if (!data[site_name]) data[site_name] = this.data[site_name];

			this.data[site_name] = Object.assign(this.data[site_name], data[site_name] || {});
			for (let i = 0; i < this.dom.length; i++) {
				let name = this.dom[i].getAttribute('name');
				// console.log(this.dom);
				this.dom[i].setAttribute('checked', this.data[site_name][name]);
				this.dom[i].addEventListener('click', (e) => {this.event(e);});
			}
		});
	},
	event: function(e) {
		let enable = e.target.getAttribute('checked');
		let name = e.target.getAttribute('name');
		if (!name) return;

		let current = !(enable === 'true');
		e.target.setAttribute('checked', current);
		this.data[site_name][name] = current;
		chrome.storage.sync.set(this.data);

		chrome.runtime.sendMessage(this.data);
	}
}
switchers.init();


// function start() {
// 	var elements = ['hideRecomRight', 'hideRecomHome', 'hideComment', 'hidePlayList', 'hideTranding'];

// 	for (var i = 0; i < elements.length; i++) {
// 		var message = chrome.i18n.getMessage(elements[i]);
// 		changeHtml(message, elements[i]);
// 	}
// }

// function changeHtml(message, element) {
// 	document.getElementsByClassName(element)[0].innerHTML = message;
// }

// start();

let bg = chrome.extension;
console.log(bg, 1);