var contentArea = document.getElementById('content');

var topics = ["Dust", "Galaxies/Galaxy Scale", "Planets/Brown Dwarfs",
	"Pre-MS Stars", "Star Formation", "Stellar Clusters/Populations",
	"High E./X-Rays", "ISM/HII/PDR", "Disks", "Feedback SF/AGN", "Other"];

function generate_catagory_box(id) {
	var arr = ["<select id=\""+id+"-cat\">"];
	for each (var topic in topics) {
		selected = (topic === "Other")
		arr.push("\t<option selected=\""+ selected +"\">"+topic+"</option>");
	}
	arr.push("</select>");
	return arr.join("\n");
}

self.port.on("show", function onShow(payload) {
	if(!payload[0]) return;
	payload = payload[1];
	contentArea.innerHTML = "";

	var form = document.createElement("form");
	payload.forEach(function(tab, i, arr) {
		form.appendChild(document.createTextNode(tab.title));
		form.appendChild(document.createElement("br"));
		form.appendChild(document.createTextNode(tab.url));
		form.appendChild(document.createElement("br"));

		var finalText = document.createElement('input');
		finalText.type = 'hidden';
		finalText.id = 'finalText-'+i;
		finalText.value = tab.title + "\n" + tab.url;

		form.appendChild(finalText);
		form.innerHTML += generate_catagory_box(i);
		form.appendChild(document.createElement("br"));
	});

	var submitButton = document.createElement('button');
	submitButton.type = "button";
	submitButton.textContent = "Save";
	submitButton.addEventListener('click', function() {
		var counter = 0;
		var entries = {};
		for each (var topic in topics)
			entries[topic] = [];

		while(true) {
			finalText = document.getElementById("finalText-"+counter);
			if (finalText === null)
				break;
			text = finalText.value;
			catagory = document.getElementById(counter + '-cat').value;
			counter++;

			entries[catagory].push(text);
		}
		self.port.emit("saveEntries", entries);
	});

	form.appendChild(submitButton);
	contentArea.appendChild(form);
});
