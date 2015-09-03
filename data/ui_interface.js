var contentArea = document.getElementById('content');

function generate_catagory_box(id, topics) {
	var arr = ["<select id=\""+id+"-cat\">"];
	arr.push("\t<option selected=\"True\">--- Skip ---</option>");
	for each (var topic in topics) {
		arr.push("\t<option>"+topic+"</option>");
	}
	arr.push("</select>");
	return arr.join("\n");
}

self.port.on("show", function onShow(payload) {
	if(!payload.update) return;
	contentArea.innerHTML = "";

	if (payload.tabs.length === 0) {
		let message = document.createElement("p");
		message.textContent = "No links starting with arxiv.org/abs/ found.";
		contentArea.appendChild(message);
	} else {
		let form = document.createElement("form");
		payload.tabs.forEach(function(tab, i, arr) {
			form.appendChild(document.createTextNode(tab.title));
			form.appendChild(document.createElement("br"));
			form.appendChild(document.createTextNode(tab.url));
			form.appendChild(document.createElement("br"));

			let finalText = document.createElement('input');
			finalText.type = 'hidden';
			finalText.id = 'finalText-'+i;
			finalText.value = tab.title + "\n" + tab.url;

			form.appendChild(finalText);
			form.innerHTML += generate_catagory_box(i, payload.topics);
			form.appendChild(document.createElement("br"));
		});

		let submitButton = document.createElement('button');
		submitButton.type = "button";
		submitButton.textContent = "Save";
		submitButton.addEventListener('click', function() {
			let counter = 0;
			let entries = {};
			for each (var topic in payload.topics)
				entries[topic] = [];

			while(true) {
				let finalText = document.getElementById("finalText-"+counter);
				if (finalText === null)
					break;
				let text = finalText.value;
				let catagory = document.getElementById(counter + '-cat').value;

				if (catagory !== '--- Skip ---')
					entries[catagory].push(text);

				counter++;
			}
			self.port.emit("saveEntries", entries);
		});

		form.appendChild(submitButton);
		contentArea.appendChild(form);
	}
});
