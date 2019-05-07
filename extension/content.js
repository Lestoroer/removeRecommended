
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

    setMaxWidthGlobalContainer();
}

chrome.storage.local.get('smart_ext_width', function (obj) {
    if (!obj || obj && !obj.smart_ext_width) {
        return setMaxWidthGlobalContainer();
    }
    setMaxWidthGlobalContainer(obj.smart_ext_width);
});


/**  */
// let interval;

// window.addEventListener('resize', (event) => {
//     if (interval) return;
//     interval = setInterval( () => {
//         setMaxWidthGlobalContainer();
//     }, 80);

//     setTimeout(() => {
//         clearInterval(interval);
//         interval = null;
//     }, 3500);
// })

setInterval( () => {
    setMaxWidthGlobalContainer();
}, 150);


function setMaxWidthGlobalContainer(localWidth) {
    let width = localWidth;

    if (!width) {
        let mainVideo = document.querySelector('.video-stream.html5-main-video');
        if (!mainVideo) return;
        width = mainVideo.style.width;
        if (!width) return;

        chrome.storage.local.set({'smart_ext_width': width});
    }

    setStyle(width);
}

function setStyle(width) {

    let smartExtStyle = document.querySelector('style.smart-ext-style');

    let css = `html[right="false"] ytd-watch-flexy #primary.ytd-watch-flexy {
	    max-width: ${width} !important;
    }`;

    if (!smartExtStyle) {
        let head = document.head || document.getElementsByTagName('head')[0];
        let style = document.createElement('style');

        head.appendChild(style);

        style.setAttribute('class', 'smart-ext-style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
    } else {
        smartExtStyle.innerHTML = css;
    }
}



    