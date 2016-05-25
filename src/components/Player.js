import React from 'react';
import { connect } from 'react-redux';
import { removePlayer, toggleAtBatById, toggleOnDeckById, toggleInHoleById} from '../actions/actions';
import classNames from 'classnames';

class Player extends React.Component {
    constructor(props) {
        super(props);
        this.openPlayerPage = this.openPlayerPage.bind(this);
        this.state = {
            atBatChecked: this.props.playerObj.toggleAtBat
        };
    }
    openPlayerPage() {
        console.log('open page for ', this.props.playerObj.p);
        chrome.tabs.create({url: `http://mlb.mlb.com/team/player.jsp?player_id=${this.props.playerObj.p}`});
    }
    render() {
        let playerStyles = {
            position: 'relative',
            backgroundColor: '#FFF',
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
            playerStyles.backgroundColor = '#FFF';
        }
        const remove = {
            position: 'absolute',
            top: '0',
            right: '0',
            padding: '5px 10px',
            backgroundColor: '#D81B60',
            color: '#FFF'
        };
        console.log('at bat class', this.props.playerObj);
        let atBatClass = classNames({
            'toggle': true,
            'toggle-active': this.props.playerObj.toggleAtBat
        });
        let onDeckClass = classNames({
            'toggle': true,
            'toggle-active': this.props.playerObj.toggleOnDeck
        });
        let inHoleClass = classNames({
            'toggle': true,
            'toggle-active': this.props.playerObj.toggleInHole
        });

        let validOrders = ['At Bat', 'In Hole', 'On Deck'];


        console.log('player in players', this.props.playerObj);
        return (
            <div className='player'>
                <div className='name-container'>
                    {this.props.playerObj.order && //validOrders.indexOf(this.props.playerObj.order) >= 0 &&
                    <p className='player-order-container'>
                        <span className='player-order'>{this.props.playerObj.order}</span>
                    </p>
                    }
                    <a className='player-name' href='#' onClick={this.openPlayerPage}>{this.props.playerObj.n}</a>
                    <span className='player-team'>{this.props.playerObj.t}</span>
                </div>
                {this.props.playerObj.timeDate && this.props.playerObj.timeDate !== 'Final' &&
                <p className='game-time'>{this.props.playerObj.timeDate} ET</p>
                }
                {this.props.playerObj.gameStatus &&
                <p className='game-status'>{this.props.playerObj.gameStatus}</p>
                }
                <div className='toggle-flex-container'>
                    <div className='toggle-checkbox-container'>
                        <p className='btn-name'>At Bat</p>
                        <p className='toggle-btn-container'>
                            <input type='checkbox' checked={this.props.playerObj.toggleAtBat} readOnly />
                            <label onClick={this.props.toggleAtBat.bind(this, this.props.playerObj.p)}></label>
                        </p>
                    </div>
                    <div className='toggle-checkbox-container'>
                        <p className='btn-name'>On Deck</p>
                        <p className='toggle-btn-container'>
                            <input type='checkbox' checked={this.props.playerObj.toggleOnDeck} readOnly />
                            <label onClick={this.props.toggleOnDeck.bind(this, this.props.playerObj.p)}></label>
                        </p>
                    </div>
                    <div className='toggle-checkbox-container'>
                        <p className='btn-name'>In Hole</p>
                        <p className='toggle-btn-container'>
                            <input type='checkbox' checked={this.props.playerObj.toggleInHole} readOnly />
                            <label onClick={this.props.toggleInHole.bind(this, this.props.playerObj.p)}></label>
                        </p>
                    </div>
                </div>

                <span className='remove' onClick={this.props.removePlayerById.bind(this, this.props.playerObj.p)}>&#x2716;</span>
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
        },
        toggleAtBat: id => {
            dispatch(toggleAtBatById(id));
        },
        toggleOnDeck: id => {
            dispatch(toggleOnDeckById(id));
        },
        toggleInHole: id => {
            dispatch(toggleInHoleById(id));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
