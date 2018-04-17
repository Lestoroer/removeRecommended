function loadCSS(file) {
	var link = document.createElement("link");
	link.href = chrome.extension.getURL('css/' + file + '.css');
	link.id = file;
	link.type = "text/css";
	link.rel = "stylesheet";
	document.getElementsByTagName("html")[0].appendChild(link);
}

function unloadCSS(file) {
  var cssNode = document.getElementById(file);
  cssNode && cssNode.parentNode.removeChild(cssNode);
}

function start(checkbox, namefile) {

	chrome.storage.sync.get(checkbox, function(item) {

     	if (Object.keys(item).length != 0) {
 			if (item[checkbox] === 'checked') {
     			loadCSS(namefile);
     		} else {
     			unloadCSS(namefile);
     		}
     	} else {
     		var obj = {};
     		if (checkbox == 'checkedComment' || checkbox == 'checkedPlayList' || checkbox == 'checkedTranding') {
     			obj[checkbox] = false;
     			unloadCSS(namefile);
     		} else {
     			obj[checkbox] = 'checked';
     			loadCSS(namefile);
     		}
     		chrome.storage.sync.set( obj );
     	}
    });
}
localStorage.setItem('ffff', 'qweqweqweqeqweeqw');

var checkbox = ["checkedMine", "checkedRight", "checkedComment", "checkedPlayList", 'checkedTranding'];
var namefile = [];

for (var i = 0; i < checkbox.length; i++) {
	namefile.push(checkbox[i]+'Style');
	start(checkbox[i], namefile[i]);
}

chrome.runtime.onMessage.addListener( function(request) { 

	for (var value in request) {

		var file = value + 'Style';
		var isId = document.querySelectorAll('#'+file).length;

		if (request[value] === 'checked' && isId == 0) {
			loadCSS(file);
		} else if (request[value] === false && isId == 1) {
			unloadCSS(file);
		} 

	}

});

