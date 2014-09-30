var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var { data } = require('sdk/self');
var { Panel } = require('sdk/panel');
var iofile = require('sdk/io/file');
var need_update = true;

var topics = ["Bag Lunch", "Dust", "Galaxies/Galaxy Scale", "Planets/Brown Dwarfs",
        "Pre-MS Stars", "Star Formation", "Stellar Clusters/Populations",
        "High E./X-Rays", "ISM/HII/PDR", "Disks", "Feedback SF/AGN", "Other"];

var button = buttons.ActionButton({
	id: "vanir",
	label: "Save Astro-ph topics",
	icon: data.url('save.svg'),
	onClick: function(state) {
		ui_interface.show();
	}
});

var ui_interface = Panel({
	contentURL: data.url('ui_interface.html'),
	contentScriptFile: data.url('ui_interface.js'),
	width: 700,
	height: 500
});

ui_interface.on("show", function() {
	var payload = []
	for each (var tab in tabs) {
		newtab:
		if (/arxiv\.org\/abs\//.test(tab.url)) {
			title = tab.title.replace(/^\[[0-9\.]*\] /, '');
			for each (var old_obj in payload) {
				if (old_obj.url === tab.url) break newtab;
			}
			payload.push({
				title: title,
				url: tab.url
			});
		}
	}

	ui_interface.port.emit("show", [need_update, payload]);
	need_update = false;
});

ui_interface.port.on('saveEntries', function(entries) {
	var DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	var text = "[title "+DAY_NAMES[new Date().getDay()] + " Papers]\n";
	var counter = 1;
	for each (var topic in topics) {
		if (entries[topic].length > 0) {
			text += topic + "\n\n";
			for each (var post in entries[topic]) {
				text += counter + ") " + post + "\n\n";
				counter++;
			}
		}
	}

	iofile.mkpath('/home/joe/hotter-topics/');
	var fh = iofile.open('/home/joe/hotter-topics/vanir-' + Date.now(), mode='w');
	fh.write(text);
	fh.close();
	ui_interface.hide();
});

tabs.on('ready', function(tab) {
	need_update = true;
});

exports.main = function(options, callbacks) {
	for each (var tab in tabs)
		tab.url = 'http://arxiv.org/list/astro-ph/pastweek?show=1000';
};
