import React from 'react';
import Players from './Players';
import Search from './Search';

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className='app-container'>
                <h1>Players</h1>
                <Players />
                <Search />
            </div>
        );
    }
}

export default App;
