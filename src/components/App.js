import React from 'react';
import { connect } from 'react-redux';
import { updateOnChanged, update, initializing } from '../actions/actions';

// components
import PlayersContainer from './PlayersContainer';
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
        this.props.initialize();
        // Listens for changes in storage.sync
        // Need to rework this.  It might be better to update by passing message from
        // eventPage to popup
        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName === 'sync') {
                this.props.storageUpdate(changes.players.newValue.players);
            }
        });
    }
    render() {
        return (
            <div className='app-container'>
                <header>
                    <h1 className='title'>Baseball Player Tracker</h1>
                </header>
                <div className='search-container'>
                    <SearchSelect />
                </div>
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
};

const mapDispatchToProps = (dispatch) => {
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
