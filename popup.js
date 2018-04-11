window.onload = function() {

	var checkbox = ['checkedMine', 'checkedRight', 'checkedComment', 'checkedPlayList', 'checkedTranding'];
	var checkboxId = [];
    
	var on = 'checked';
	var off = false;

	function start(checkbox, checkboxId) {
		chrome.storage.sync.get(checkbox, function(item) {
			var checked = item[checkbox];
			// console.log(checked);
			document.querySelector(checkboxId).checked = (checked === false || checked == 'checked') ? checked : true;
		});
	}

	function change(checkbox, checkboxId) {
		document.querySelector(checkboxId).addEventListener('change', function(e) {
			console.log(this);
			this.classList.add('anim');
			var obj = {};

			chrome.storage.sync.get(checkbox, function(item) { 
				if (item[checkbox] === 'checked') {
					document.querySelector(checkboxId).setAttribute('checked', off);

					obj[checkbox] = off;
					chrome.storage.sync.set( obj );
				} else {
					document.querySelector(checkboxId).setAttribute('checked', on);
					
					obj[checkbox] = on;
					chrome.storage.sync.set( obj );
				}

			    chrome.runtime.sendMessage( obj );
			});

		});
	}

	for (var i = 0; i < checkbox.length; i++) {
		checkboxId.push('#'+checkbox[i]);
		start(checkbox[i], checkboxId[i]);
		change(checkbox[i], checkboxId[i]);
	}

};
