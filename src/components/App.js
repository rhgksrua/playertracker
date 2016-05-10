import React from 'react';
import { connect } from 'react-redux';
import { update } from '../actions/actions';

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
        console.log('--chrome', chrome);
        chrome.alarms.create('update', {periodInMinutes: 1});
        chrome.alarms.onAlarm.addListener(() => {
            console.log('chrome alarm fired off');
            chrome.storage.sync.get('value', function(val) {
                console.log(val.value);
                if (val.value === 'undefined') {
                    chrome.storage.sync.set({'value': 0});
                } else {
                    chrome.storage.sync.set({'value': +val.value + 1});
                }
                //console.log(val);
            });
        });
        //let currentInterval = setInterval(this.props.update, 5000);
        //this.setState({ interval: currentInterval });
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
