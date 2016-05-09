import React from 'react';
import { connect } from 'react-redux';

class Search extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log(this.props);
        return (
            <div className='search-container'>
                <h2>Search Player</h2>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { playerIds } = state;
    return {
        playerIds
    };
}

export default connect(mapStateToProps)(Search);
