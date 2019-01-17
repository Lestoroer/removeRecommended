
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
    // console.log(document.querySelector('.ytp-progress-list'))
    // document.querySelector('.ytp-progress-list').addEventListener('mousemove', function(event) {
    //     console.log(event.clientX)
    //     document.querySelector('.ytp-hover-progress').style.width = `${event.clientX}px`;
    // });


}

// setInterval( () => {

//     // const isRightRecommended = document.querySelector('html').getAttribute('right')
//     // if (isRightRecommended === 'true') return;
    

//     const ytpPlayProgress = document.querySelector('.ytp-hover-progress');
//     if (!ytpPlayProgress) return;
//     const ytpPlayProgressLeft = parseInt(ytpPlayProgress.style.left, 10);
    
//     document.querySelector('.ytp-play-progress').style.width = `${ytpPlayProgressLeft}px`;
// }, 100);

    