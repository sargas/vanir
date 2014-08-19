var textArea = document.getElementById('testing_area');

function generate_catagory_box(id) {
	var topics = ["Dust", "Galaxies/Galaxy Scale", "Planets/Brown Dwarfs",
		"Pre-MS Stars", "Star Formation", "Stellar Clusters/Populations",
		"High E./X-Rays", "ISM/HII/PDR", "Disks", "Feedback SF/AGN", "Other"];

	var arr = ["<select name=\""+id+"-cat\">"];
	for each (var topic in topics) {
		selected = (topic === "Other")
		arr.push("\t<option selected=\""+ selected +"\">"+topic+"</option>");
	}
	arr.push("</select>");
	return arr.join("\n");
}

self.port.on("show", function onShow(payload) {
	text = "<form>";
	for each (var tab in payload) {
		text += tab.title + "<br/>\n" + tab.url + "\n<br/>";
		text += generate_catagory_box("43");
		text += "<br/>";
	}
	text += "</form>";
	textArea.innerHTML = text;
	console.log(text);
});
