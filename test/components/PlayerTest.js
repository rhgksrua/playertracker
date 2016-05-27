import React from 'react';
import TestUtils from 'react-addons-test-utils';
import expect from 'expect';
import { Player } from '../../src/components/Player';
import { mount, shallow } from 'enzyme';

function setup() {
	let propPlayer= {
		n: 'player name',
		p: '123456',
		t: 'player team',
		toggleAtBat: true,
		toggleOnDeck: true,
		toggleInHole: false
	};
	let props = {
		toggleAtBat: expect.createSpy(),
		toggleOnDeck: expect.createSpy(),
		toggleInHole: expect.createSpy(),
		removePlayerById: expect.createSpy(),
		toggleInteraction: expect.createSpy(),
		playerObj: propPlayer
	};
	let renderer = TestUtils.createRenderer();
	renderer.render(<Player {...props} />);
	let output = renderer.getRenderOutput();

	let wrapper = mount(<Player {...props} />);

	return {
		props,
		output,
		renderer,
		wrapper
		
	};
}

describe('Player Component', () => {

	it('should have name container', () => {
		const { wrapper } = setup();
		expect(wrapper.find('.name-container').length).toEqual(1);

	});

	it('should toggle at bat when clicked', () => {
		const { props, wrapper } = setup();
		wrapper.find('.label-at-bat').simulate('click');
		expect(wrapper.simulate('click'));
		expect(props.toggleAtBat.calls.length).toBe(1);


	});

	// Not using enzyme
	xit('should render correctly', () => {
		const { output } = setup();
		expect(output.type).toBe('div');
		expect(output.props.className).toBe('player');
	});
	xit('should toggle at bat', () => {
		const { output, props } = setup();
		props.toggleAtBat(props.playerObj.p);
		expect(props.toggleAtBat.calls.length).toBe(1);
	});
	xit('should toggle at bat when clicked', () => {


	});

});