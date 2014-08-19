var buttons = require('sdk/ui/button/action');
var tabs = require('sdk/tabs');
var data = require('sdk/self').data;

var button = buttons.ActionButton({
	id: "vanir",
	label: "Save Astro-ph topics",
	icon: data.url('save.svg'),
	onClick: handleClick
});

function handleClick(state) {
	tabs.open('http://example.com');
}
