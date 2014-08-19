var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var { data } = require('sdk/self');
var { Panel } = require('sdk/panel');

var button = buttons.ActionButton({
	id: "vanir",
	label: "Save Astro-ph topics",
	icon: data.url('save.svg'),
	onClick: handleClick
});

var ui_interface = Panel({
	contentURL: data.url('ui_interface.html'),
	contentScriptFile: data.url('ui_interface.js')
});

function handleClick(state) {
	ui_interface.show();
}

ui_interface.on("show", function() {
	var payload = []
	for each (var tab in tabs) {
		if (/arxiv\.org\/abs\//.test(tab.url)) {
			title = tab.title.replace(/^\[[0-9\.]*\] /, '');
			payload.push({
				title: title,
				url: tab.url
			});
		}
	}

	ui_interface.port.emit("show", payload);
});
