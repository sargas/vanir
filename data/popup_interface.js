Array.prototype.forEach.call(document.getElementsByTagName("button"), function (x) {
	x.addEventListener(
		'click', function() {
			self.port.emit(x.id);
		});
});
