import React from 'react';
import { connect } from 'react-redux';
import { update, initializing } from '../actions/actions';

// components
import PlayersContainer from './PlayersContainer';
import Search from './Search';


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
    }
    render() {
        return (
            <div className='app-container'>
                <h1>Players</h1>
                <button onClick={this.props.update}>update</button>
                <PlayersContainer />
                <Search />
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
