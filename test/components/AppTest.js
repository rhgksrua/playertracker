import { App } from '../../src/components/App';

import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';

import { domMock } from './dom-mock';

import jsdom from 'mocha-jsdom';
import expect from 'expect';

domMock('<html><body></body></html>');


describe('First test', () => {
	const shallowRenderer = TestUtils.createRenderer();
	//jsdom({ skipWindowCheck: true});

	it('should show title', () => {

		shallowRenderer.render(<App />);
		const myApp = shallowRenderer.getRenderOutput();

		expect(myApp.type).toBe('div');
		expect(myApp.props.className).toBe('app-container');

	});

});