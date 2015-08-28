var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
const { Panel } = require('sdk/panel');
const { ToggleButton } = require('sdk/ui/button/toggle');
const { browserWindows } = require('sdk/windows');
var iofile = require('sdk/io/file');
var need_update = true;

var topics = ["Bag Lunch", "Computational Methods", "Crackpot", "Dust", "Galaxies/Galaxy Scale", "Instrumentation",
	    "Planets/Brown Dwarfs", "Pre-MS Stars", "Star Formation", "Stellar Clusters/Populations",
        "High E./X-Rays", "ISM/HII/PDR", "Disks", "Feedback SF/AGN", "Other Stars / Binaries", "Other"];

var button = ToggleButton({
	id: "vanir",
	label: "UToledo Hotter Topics",
	icon: './save.svg',
	onChange: handleToggleButton
});

var button_panel = Panel({
	contentURL: './popup_interface.html',
	contentScriptFile: './popup_interface.js',
	onHide: handleHidePanel
});

function handleToggleButton(state) {
	if (state.checked) {
		button_panel.show({
			position: button
		});
	} else {
		button_panel.hide();
		handleHidePanel();
	}
}

function handleHidePanel() {
	button.state("window", {checked: false});
}

button_panel.port.on('open-astroph', function() {
	browserWindows.open('http://arxiv.org/list/astro-ph/pastweek?show=1000');
});

button_panel.port.on('save-astroph', function() {
	ui_interface.show();
});

var ui_interface = Panel({
	contentURL: './ui_interface.html',
	contentScriptFile: './ui_interface.js',
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

	ui_interface.port.emit("show", {
		update: need_update,
		topics: topics,
		tabs: payload
	});
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
	if (/arxiv\.org\/abs\//.test(tab.url)) {
		need_update = true;
	}
});
