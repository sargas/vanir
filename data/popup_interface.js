['open-astroph', 'save-astroph', 'open-prefs', 'launch-help'].forEach(function(x) {
	document.getElementById(x).addEventListener(
			'click', function() {
				self.port.emit(x);
			});
});
