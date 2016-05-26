import expect from 'expect';
import * as actions from '../../src/actions/actions';
import * as reducers from '../../src/reducers/reducers';
import sinonChrome from 'sinon-chrome';

describe('reducers', () => {
	describe('playerList', () => {


		let dirtyState;

		before(function() {
			global.chrome = sinonChrome;
		});

		beforeEach(function() {
			dirtyState = {
				gameTimeSet: false,
				players: [{
					n: 'player name',
					p: '123456',
					t: 'player team',
					toggleAtBat: true,
					toggleOnDeck: true,
					toggleInHole: false
				}]
			}
		});

		it('should return initial state for playerList', () => {
			expect(
				reducers.playerList(undefined, {})
			).toEqual({
				gameTimeSet: false,
				players: []
			});
		});

		it('should handle adding a player', () => {
			const initialState = {
				gameTimeSet: false,
				players: []
			};
			const player = {
				n: 'player name',
				p: 'player id',
				t: 'player team'
			};
			expect(
				reducers.playerList(initialState, {
					type: actions.ADD_PLAYER,
					player: {
						n: 'player name',
						p: 'player id',
						t: 'player team'
					}
				})
			).toEqual({
				gameTimeSet: false,
				players: [player]
			});

		});

		it('should handle removing a player', () => {
			const playerId = '123456';
			expect(
				reducers.playerList(dirtyState, {
					type: actions.REMOVE_PLAYER,
					playerId
				})
			).toEqual({
				gameTimeSet: false,
				players: []
			});

		});

		it('should handle toggle at bat', () => {
			const id = '123456'
			expect(
				reducers.playerList(dirtyState, {
					type: actions.TOGGLE_AT_BAT,
					id
				})
			).toEqual({
				gameTimeSet: false,
				players: [
					{
						n: 'player name',
						p: '123456',
						t: 'player team',
						toggleAtBat: false,
						toggleOnDeck: true,
						toggleInHole: false,
					}
				]
			});
		});

		it('should handle toggle on deck', () => {
			const id = '123456'
			expect(
				reducers.playerList(dirtyState, {
					type: actions.TOGGLE_ON_DECK,
					id
				})
			).toEqual({
				gameTimeSet: false,
				players: [
					{
						n: 'player name',
						p: '123456',
						t: 'player team',
						toggleAtBat: true,
						toggleOnDeck: false,
						toggleInHole: false,
					}
				]
			});
		});

		it('should handle toggle in hole', () => {
			const id = '123456'
			expect(
				reducers.playerList(dirtyState, {
					type: actions.TOGGLE_IN_HOLE,
					id
				})
			).toEqual({
				gameTimeSet: false,
				players: [
					{
						n: 'player name',
						p: '123456',
						t: 'player team',
						toggleAtBat: true,
						toggleOnDeck: true,
						toggleInHole: true,
					}
				]
			});
		});

	});
	
	describe('options', () => {
		it('should return true', () => {
			expect(true).toEqual(true);

		});

	});
});