import React from 'react';
import { connect } from 'react-redux';
import Autocomplete from 'react-autocomplete';
import { styles } from '../styles/autocomplete';
import { addPlayer } from '../actions/actions';

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.matchStateToTerm = this.matchStateToTerm.bind(this);
        this.onSelectAddPlayer = this.onSelectAddPlayer.bind(this);
    }
    render() {
        // this.props.playerIds is an array of objects.
        // t: teamname
        // n: player name
        // p: player id
        const wrapperStyle = {
            height: '100px',
            display: 'block'
        };
        return (
            <div className='search-container'>
                <h2>Add Player</h2>
                <Autocomplete
                    wrapperStyle={wrapperStyle}
                    value=''
                    labelText=''
                    inputProps={{name: 'players'}}
                    items={this.props.playerIds}
                    shouldItemRender={this.matchStateToTerm}
                    getItemValue={(item) => item.n}
                    onSelect={this.onSelectAddPlayer}
                    onChange={(event, value) => { console.log('on change', value) }}
                    renderItem={(item, isHighlighted) => (
                        <div
                            style={isHighlighted ? styles.highlightedItem : styles.item}
                            key={item.p}>
                            {item.n} {item.t}
                        </div>
                    )}
                    renderMenu={(items, value, style) => (
                        <div style={{border: 'solid 1px #ccc', 'maxHeight': '100px', overflow: 'auto', 'cursor': 'default'}}>
                            {value === '' ? (
                                <div style={{padding: 4}}>Enter player name</div>
                            ) : this.renderItems(items)}
                        </div>
                    )}
                />
            </div>
        );
    }
    matchStateToTerm (state, value) {
        return state.n.toLowerCase().indexOf(value.toLowerCase()) !== -1
    }
    renderItems(items) {
        return items.map((item, index) => {
            return item;
        });
    }
    onSelectAddPlayer(playerName, playerObj) {
        // add player id to store
        console.log(playerName, playerObj);
        this.props.addPlayerObj(playerObj);
    }
}

const mapStateToProps = (state) => {
    const { playerIds } = state;
    return {
        playerIds
    };
}

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        addPlayerObj: (playerObj) => {
            dispatch(addPlayer(playerObj));
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
