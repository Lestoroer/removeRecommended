function loadCSS(file='smart_extensions_style') {
	var link = document.createElement("link");
	link.href = chrome.extension.getURL('css/' + file + '.css');
	link.id = file;
	link.type = "text/css";
	link.rel = "stylesheet";
	document.getElementsByTagName("html")[0].appendChild(link);
}
loadCSS();


function start(data) {
	chrome.storage.sync.get(function(item) {
        for (let i in item) {
            if (i === 'sort' || i === 'login') continue;
            if (location.href.includes(i)) { // site
                let body = document.querySelector('html');
                for (let k in item[i]) {
                    body.setAttribute(k, item[i][k]);
                }
            }
        }
    });
}
start();
chrome.runtime.onMessage.addListener(function (data) {
	start(data);
});

window.onload = function () {
    if (location.href.includes('127.0.0.1') || location.href.includes('smart-extension.com')) {
        let login = document.querySelector('[login]');
        if (!login) return;
        let user = JSON.parse(login.innerHTML);

        chrome.storage.sync.get((data) => {
            data.login = user;
            chrome.storage.sync.set(data);
        });
    }
}
    