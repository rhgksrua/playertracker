import React from 'react';
import { connect } from 'react-redux';
import { removePlayer } from '../actions/actions';

class Player extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className='player'>
                <h3>{this.props.playerObj.n}</h3>
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
