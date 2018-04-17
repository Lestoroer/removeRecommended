//title = chrome.i18n.getMessage("extName");

function start() {
	var elements = ['hideRecomRight', 'hideRecomHome', 'hideComment', 'hidePlayList', 'hideTranding'];

	for (var i = 0; i < elements.length; i++) {
		var message = chrome.i18n.getMessage(elements[i]);
		changeHtml(message, elements[i]);
	}
}

function changeHtml(message, element) {
	document.getElementsByClassName(element)[0].innerHTML = message;
}

start();