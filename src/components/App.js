import React from 'react';
import { connect } from 'react-redux';
import { updateOnChanged, update, initializing } from '../actions/actions';

// components
import PlayersContainer from './PlayersContainer';
import Search from './Search';
import SearchSelect from './SearchSelect';


class App extends React.Component {
    constructor(props) {
        super(props);
        // If interval needs to be cleared, use this.
        this.state = { interval: '' };
    }
    /**
     * Begins updating players.
     *
     * @returns {undefined}
     */
    componentDidMount() {
        //console.log('--chrome', chrome);
        this.props.initialize();
        // Listens for changes in storage.sync
        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName === 'sync') {
                console.log(changes);
                this.props.storageUpdate(changes.players.newValue.players);
            }
        });
    }
    render() {
        return (
            <div className='app-container'>
                <h1>Player Tracker</h1>
                <SearchSelect />
                <PlayersContainer />
            </div>
        );
    }
}

/*******************************************************************
 *
 * Redux
 *
 ******************************************************************/

const mapStateToProps = (state) => {
    const { playerList, options } = state;
    return {
        playerList,
        options
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        update: () => {
            dispatch(update());
        },
        initialize: () => {
            dispatch(initializing());
        },
        storageUpdate: (obj) => {
            dispatch(updateOnChanged(obj));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
