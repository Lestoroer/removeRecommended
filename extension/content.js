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
    console.log('data', data);
	chrome.storage.sync.get(function(item) {
        for (let i in item) {
            if (i === 'sort') continue;
            if (location.href.includes(i)) { // site 
                console.log('site', i);
                let body = document.querySelector('html');
                for (let k in item[i]) {
                    console.log('attr');
                    body.setAttribute(k, item[i][k]);
                }
            }
        }
    });
}
start();
chrome.runtime.onMessage.addListener(function (data) { 
    // return console.log(data);
    console.log(data);
	start(data);
});

console.log('content');