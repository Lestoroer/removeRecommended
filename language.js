let language = {
	dom:document.querySelectorAll('[text]'),
	init: function() {

		for (let i = 0; i < this.dom.length; i++) {
			this.dom[i].innerText = chrome.i18n.getMessage(this.dom[i].getAttribute('text'));
			//this.dom[i].innerText = lang[this.dom[i].getAttribute('text')];
		}
	}
}

language.init();