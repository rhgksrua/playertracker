import React from 'react';
import { connect } from 'react-redux';
import { addPlayer } from '../actions/actions';
import Select from 'react-select';

/**
 * Consider using 'react-virtualized-select' because of the size of
 * playerlist
 */

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.selectPlayer = this.selectPlayer.bind(this);
        this.renderValue = this.renderValue.bind(this);
        this.renderOption = this.renderOption.bind(this);
        this.state = {
            value: ''
        };
    }
    renderValue(option) {
        return <span><span className='team'>{option.t}</span>{option.n}</span>;
    }
    renderOption(option) {
        return <span><span className='team'>{option.t}</span> {option.n}</span>;
    }
    render() {
        // this.props.playerIds is an array of objects.
        // t: teamname
        // n: player name
        // p: player id
        return (
            <Select
                name='player-names'
                value={this.state.value}
                options={this.props.playerIds}
                onChange={this.selectPlayer}
                onInputChange={inputValue => inputValue}
                clearable={false}
                searchable
                optionRenderer={this.renderOption}
                valueRenderer={this.renderValue}
                valueKey={'n'}
            />
        );
    }
    /**
     * logChange
     *
     * @param  {[type]} player [description]
     * @return {[type]}        [description]
     */
    selectPlayer(player) {
        this.setState({value: player.n});
        if (this.playerExists(player.p)) {
            return;
        }
        this.props.addPlayerObj(player);
    }
    /**
     * playerExists
     * Checks playerList for duplicates
     * @param  {string}  playerId [id of selected player]
     * @return {boolean}          [exists or not]
     */
    playerExists(playerId) {
        let players = this.props.playerList.players;
        let exists = players.some(p => {
            return playerId === p.p;
        });
        if (exists) return true;
        return false;
    }
    onSelectAddPlayer(playerName, playerObj) {
        // add player id to store
        console.log(playerName, playerObj);
        this.props.addPlayerObj(playerObj);
    }
}

const mapStateToProps = (state) => {
    const { playerIds, playerList } = state;
    return {
        playerIds,
        playerList
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addPlayerObj: (playerObj) => {
            dispatch(addPlayer(playerObj));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Search);
