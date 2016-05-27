import jsdom from 'jsdom';
const dom = jsdom.jsdom;


export function domMock(markup) {
	if (typeof document !== 'undefined') return;
	global.document = dom(markup || '');
	global.window = document.defaultView;
	global.navigator = {
		userAgent: 'node.js'
	};
}