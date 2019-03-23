
loadCSS();
function loadCSS(file='smart_extensions_style') {
	var link = document.createElement("link");
	link.href = chrome.extension.getURL('css/' + file + '.css');
	link.id = file;
	link.type = "text/css";
	link.rel = "stylesheet";
	document.getElementsByTagName("html")[0].appendChild(link);
}

start();
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

// function setRecommChannel () {
//     let interval = setInterval( () => {
//         let paper_buttons = document.querySelectorAll('ytd-item-section-renderer');
//         if (paper_buttons.length == 0) return;
//         //console.log(paper_buttons)
//         for (let paper_button of paper_buttons) {
//             //if (paper_button.querySelector('ytd-subscribe-button-renderer')) paper_button.outerHTML = '';
//             console.log(paper_button.closest('ytd-item-section-renderer'));
//         }
//     }, 100);
// }

// setRecommChannel();


    