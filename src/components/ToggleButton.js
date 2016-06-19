import React from 'react';

class ToggleButton extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<div className='toggle-checkbox-container'>
                <p className='btn-name'>{this.props.buttonName}</p>
                <p className='toggle-btn-container'>
                    <input type='checkbox' checked={this.props.toggleChecked} readOnly />
                    <label onClick={this.props.toggleOnClick}></label>
                </p>
            </div>
		);
	}
}

ToggleButton.propTypes = {
	buttonName: React.PropTypes.func,
	toggleChecked: React.PropTypes.func,
	toggleOnClick: React.PropTypes.func
};

export default ToggleButton;