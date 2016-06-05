import React from 'react';
import { connect } from 'react-redux';
import { removePlayer, 
         toggleAtBatById, 
         toggleOnDeckById, 
         toggleInHoleById, 
         toggleInteraction,
         toggleNotify
       } from '../actions/actions';
import classNames from 'classnames';
import ToggleButton from './ToggleButton';

export class Player extends React.Component {
    constructor(props) {
        super(props);
        this.openPlayerPage = this.openPlayerPage.bind(this);
        this.openMlbTv = this.openMlbTv.bind(this);
        this.state = {
            atBatChecked: this.props.playerObj.toggleAtBat
        };
    }
    openPlayerPage() {
        chrome.tabs.create({url: `http://mlb.mlb.com/team/player.jsp?player_id=${this.props.playerObj.p}`});
    }
    openMlbTv(url) {
        if (this.props.playerObj.gameStatus === 'In Progress' && url) {
            chrome.tabs.create({ url });
        }
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

        let gameStatusClass = classNames({
            'game-status': true,
            'game-status-click': this.props.playerObj.gameStatus === 'In Progress'
        });

        let validOrders = ['At Bat', 'In Hole', 'On Deck'];


        return (
            <div className='player'>
                <div className='name-container'>
                    {this.props.playerObj.order &&
                    <p className='player-order-container'>
                        <span className='player-order'>{this.props.playerObj.order}</span>
                    </p>
                    }
                    <a className='player-name' href='#' onClick={this.openPlayerPage}>{this.props.playerObj.n}</a>
                    <span className='player-team'>{this.props.playerObj.t}</span>
                </div>
                {this.props.playerObj.timeDate && this.props.playerObj.timeDate !== 'Final' && this.props.playerObj.timeDate !== 'No Game' &&
                <p className='game-time'>{this.props.playerObj.timeDate} ET</p>
                }
                {this.props.playerObj.gameStatus &&
                <p className={gameStatusClass} onClick={this.openMlbTv.bind(this, this.props.playerObj.mlbtv)}>{this.props.playerObj.gameStatus}</p>
                }
                <div className='toggle-flex-container'>
                    <ToggleButton
                        buttonName='At Bat'
                        toggleChecked={this.props.playerObj.toggleAtBat}
                        toggleOnClick={this.props.toggleAtBat.bind(this, this.props.playerObj.p)}
                    />
                    <ToggleButton
                        buttonName='On Deck'
                        toggleChecked={this.props.playerObj.toggleOnDeck}
                        toggleOnClick={this.props.toggleOnDeck.bind(this, this.props.playerObj.p)}
                    />
                    <ToggleButton 
                        buttonName='In Hole' 
                        toggleChecked={this.props.playerObj.toggleInHole} 
                        toggleOnClick={this.props.toggleInHole.bind(this, this.props.playerObj.p)} 
                    />
                    <ToggleButton 
                        buttonName='Notify' 
                        toggleChecked={this.props.playerObj.toggleNotify} 
                        toggleOnClick={this.props.toggleNotify.bind(this, this.props.playerObj.p)} 
                    />
                </div>
                <span className='remove' onClick={this.props.removePlayerById.bind(this, this.props.playerObj.p)}>&#x2716;</span>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ownProps;
};

export const mapDispatchToProps = (dispatch) => {
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
        },
        toggleInteraction: id => {
            dispatch(toggleInteraction(id));
        },
        toggleNotify: id => {
            dispatch(toggleNotify(id));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);
