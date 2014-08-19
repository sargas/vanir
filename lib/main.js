var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var self = require('sdk/self');

var button = buttons.ActionButton({
	id: "vanir",
	label: "Save Astro-ph topics",
	icon: self.data.url('save.svg'),
	onClick: handleClick
});

function handleClick(state) {
	for each (var tab in tabs) {
		if (/arxiv\.org\/abs\//.test(tab.url))
			title = tab.title.replace(/^\[[0-9\.]*\] /, '');
			console.log(title + "\n" + tab.url);
	}
}
