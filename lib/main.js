var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var { data } = require('sdk/self');
var { Panel } = require('sdk/panel');
var iofile = require('sdk/io/file');

var topics = ["Dust", "Galaxies/Galaxy Scale", "Planets/Brown Dwarfs",
        "Pre-MS Stars", "Star Formation", "Stellar Clusters/Populations",
        "High E./X-Rays", "ISM/HII/PDR", "Disks", "Feedback SF/AGN", "Other"];

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

ui_interface.port.on('saveEntries', function(entries) {
	console.log(entries);
	var fh = iofile.open('/tmp/vanir-' + Date.now(), mode='w');
	text = "";
	counter = 1;
	for each (var topic in topics) {
		if (entries[topic].length > 0) {
			text += topic + "\n";
			for each (var post in entries[topic]) {
				text += counter + ") " + post + "\n\n";
				counter++;
			}
		}
	}

	fh.write(text);
	fh.close();
	ui_interface.hide();
});
