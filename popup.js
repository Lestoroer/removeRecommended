$(document).ready(function() {

	var checkbox = ['checkedMine', 'checkedRight', 'checkedComment', 'checkedPlayList', 'checkedTranding'];
	var checkboxId = [];
    
	var on = 'checked';
	var off = false;

	function start(checkbox, checkboxId) {
		chrome.storage.sync.get(checkbox, function(item) { 
			var checked = item[checkbox];

			if (checked === 'checked') {
				$(checkboxId).attr('checked', checked);
			} else {
				$(checkboxId).attr('checked', 'checked');
				if (checked === false) {
					$(checkboxId).attr('checked', checked);
				} else {
					$(checkboxId).attr('checked', 'checked');
				}
			}
		});
	}

	function change(checkbox, checkboxId) {
		$(checkboxId).on('change', function() {

			var obj = {};

			chrome.storage.sync.get(checkbox, function(item) { 
				if (item[checkbox] === 'checked') {
					$(checkboxId).attr('checked', off);

					obj[checkbox] = off;
					chrome.storage.sync.set( obj );
				} else {
					$(checkboxId).attr('checked', on);
					
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

});
