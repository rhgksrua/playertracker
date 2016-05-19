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
        return (
            <div className='player'>
                <h3><a href='#' onClick={this.openPlayerPage}>{this.props.playerObj.n}</a></h3>
                <p>{this.props.playerObj.p}</p>
                <p>{this.props.playerObj.t}</p>
                {this.props.playerObj.time &&
                <p>Time {this.props.playerObj.time}</p>
                }
                {this.props.playerObj.order &&
                <p>Order {this.props.playerObj.order}</p>
                }
                {this.props.playerObj.lastUpdated &&
                <p>Last Updated {this.props.playerObj.lastUpdated}</p>
                }
                {this.props.playerObj.gameStatus &&
                <p>Game Status: {this.props.playerObj.gameStatus}</p>
                }

                <button onClick={this.props.removePlayerById.bind(this, this.props.playerObj.p)}>Remove</button>
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
