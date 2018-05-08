function loadCSS(file='smart_extensions_style') {
	var link = document.createElement("link");
	link.href = chrome.extension.getURL('css/' + file + '.css');
	link.id = file;
	link.type = "text/css";
	link.rel = "stylesheet";
	document.getElementsByTagName("html")[0].appendChild(link);
}
loadCSS();

console.log(location.href);

function start(data) {
    console.log('data', data);
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
    if (location.href.includes('127.0.0.1')) {
        let login = document.querySelector('[login]');
        if (!login) return;
        let user = JSON.parse(login.innerHTML).response[0];
        // console.log(JSON.parse(data).response[0]);
        chrome.storage.sync.get((data) => {
            console.log('success');
            data.login = user;
            chrome.storage.sync.set(data);
        });
    }
}
    