import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from '../reducers/reducers';

// Components
import App from './App';

const loggerMiddleware = createLogger();

let store = createStore(reducers, applyMiddleware(thunkMiddleware, loggerMiddleware));

require('../styles/index.scss');
require('react-select/scss/default.scss');

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('app'));
