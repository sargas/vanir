function send_port_msg(msg) {
	return function() {
		self.port.emit(msg);
	};
};

document.getElementById('open-astroph').addEventListener(
		'click', send_port_msg('open-astroph'));

document.getElementById('save-astroph').addEventListener(
		'click', send_port_msg('save-astroph'));
