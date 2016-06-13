
const Logger = {
	createLog(msg = 'none') {
		if (process.env.NODE_ENV === 'production') {
			console.log('production not logging');
			return;
		}
		chrome.storage.local.get('logs', function(item) {
			let store;
			if (!item.logs) {
				store = {
					'logs': [
						{
							time: new Date().toString(),
							msg
						}
					]
				};

			} else {
				store = {
					'logs': item.logs.concat({
						time: new Date().toString(),
						msg
					})
				};
			}
			chrome.storage.local.set(store);

		});
	},
	getLog() {

	}
};


export default Logger;