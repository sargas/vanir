var contentArea = document.getElementById('content');

function generate_catagory_box(id, topics) {
	var arr = ["<select id=\""+id+"-cat\">"];
	for each (var topic in topics) {
		selected = (topic === "Other")
		arr.push("\t<option selected=\""+ selected +"\">"+topic+"</option>");
	}
	arr.push("</select>");
	return arr.join("\n");
}

self.port.on("show", function onShow(payload) {
	if(!payload.update) return;
	contentArea.innerHTML = "";

	var form = document.createElement("form");
	payload.tabs.forEach(function(tab, i, arr) {
		form.appendChild(document.createTextNode(tab.title));
		form.appendChild(document.createElement("br"));
		form.appendChild(document.createTextNode(tab.url));
		form.appendChild(document.createElement("br"));

		var finalText = document.createElement('input');
		finalText.type = 'hidden';
		finalText.id = 'finalText-'+i;
		finalText.value = tab.title + "\n" + tab.url;

		form.appendChild(finalText);
		form.innerHTML += generate_catagory_box(i, payload.topics);
		form.appendChild(document.createElement("br"));
	});

	var submitButton = document.createElement('button');
	submitButton.type = "button";
	submitButton.textContent = "Save";
	submitButton.addEventListener('click', function() {
		var counter = 0;
		var entries = {};
		for each (var topic in payload.topics)
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
