import React from 'react';
import { connect } from 'react-redux';
import { removePlayer } from '../actions/actions';

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.openPlayerPage = this.openPlayerPage.bind(this);
    }
    openPlayerPage() {
        console.log('open page for ', this.props.playerObj.p);
        chrome.tabs.create({url: `http://mlb.mlb.com/team/player.jsp?player_id=${this.props.playerObj.p}`});
    }
    render() {
        let playerStyles = {
            position: 'relative',
            backgroundColor: '#EBEBEB',
            padding: '4px 10px',
            marginBottom: '10px',
            boxShadow: '3px 5px 10px rgba(0, 0, 0, 0.12)'
        };
        if (this.props.playerObj.order === 'At Bat') {
            playerStyles.backgroundColor = '#7CB342';
        } else if (this.props.playerObj.order === 'On Deck') {
            playerStyles.backgroundColor = '#FFEE58';
        } else if (this.props.playerObj.order === 'In Hole') {
            playerStyles.backgroundColor = '#BBDEFB';
        } else {
            playerStyles.backgroundColor = '#EBEBEB';
        }
        const remove = {
            position: 'absolute',
            top: '0',
            right: '0',
            padding: '5px 10px',
            backgroundColor: '#D81B60',
            color: '#FFF'
        };
        return (
            <div className='player' style={playerStyles}>
                <h3><a href='#' onClick={this.openPlayerPage}>{this.props.playerObj.n}</a></h3>
                <p>{this.props.playerObj.t}</p>
                {this.props.playerObj.time &&
                <p>Time {this.props.playerObj.time}</p>
                }
                {this.props.playerObj.order &&
                <p>Order {this.props.playerObj.order}</p>
                }
                {this.props.playerObj.gameStatus &&
                <p>Game Status: {this.props.playerObj.gameStatus}</p>
                }

                <div style={remove} onClick={this.props.removePlayerById.bind(this, this.props.playerObj.p)}>Remove</div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ownProps;
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        removePlayerById: playerId => {
            dispatch(removePlayer(playerId));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
