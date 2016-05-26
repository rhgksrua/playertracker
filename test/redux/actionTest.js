import expect from 'expect';
import * as actions from '../../src/actions/actions';

describe('actions', () => {
	it('should create an action to add player', () => {
		const player = {
			n: 'player name',
			p: 'player id',
			t: 'player team'
		};
		const expectedAction = {
			type: actions.ADD_PLAYER,
			player
		}
		expect(actions.addPlayer(player)).toEqual(expectedAction);
	});

	it('should create an action to remove player', () => {
		const playerId = '123456';
		const expectedAction = {
			type: actions.REMOVE_PLAYER,
			playerId
		};
		expect(actions.removePlayer(playerId)).toEqual(expectedAction);
	});

	it('should create an action to toggle at bat by id', () => {
		const id = '123456';
		const expectedAction = {
			type: actions.TOGGLE_AT_BAT,
			id
		};
		expect(actions.toggleAtBatById(id)).toEqual(expectedAction);
	});

	it('should create an action to toggle on deck by id', () => {
		const id = '123456';
		const expectedAction = {
			type: actions.TOGGLE_ON_DECK,
			id
		};
		expect(actions.toggleOnDeckById(id)).toEqual(expectedAction);
	});

	it('should create an action to toggle in hole by id', () => {
		const id = '123456';
		const expectedAction = {
			type: actions.TOGGLE_IN_HOLE,
			id
		};
		expect(actions.toggleInHoleById(id)).toEqual(expectedAction);
	});

	it('should create an action to update on change in chrome storage', () => {
		const players = {
			players: {
				players: [
					{
						n: 'player name',
						t: 'player team',
						p: 'player id'
					}
				]
			}
		}
		const expectedAction = {
			type: actions.UPDATE_ON_CHANGE,
			players	
		};
		expect(actions.updateOnChanged(players)).toEqual(expectedAction);
	});

	it('should create an action to initialize player data', () => {
		const val = {
			players: [
				{
					n: 'player name',
					p: 'player id',
					t: 'player team'
				}
			]
		};
		const expectedAction = {
			type: actions.INITIALIZE,
			val
		}
		expect(actions.initialize(val)).toEqual(expectedAction);

	});
});