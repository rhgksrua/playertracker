import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import reducers from '../reducers/reducers';
import App from './App';

/*****************************************************************
 *
 * CSS
 *
 ****************************************************************/

 // app
import '../styles/index.scss';

// react-select
import 'react-select/scss/default.scss';

/*****************************************************************
 *
 * End of CSS
 *
 ****************************************************************/

const middlewares = [thunkMiddleware];

if (process.env.NODE_ENV === 'development') {
	const createLogger = require('redux-logger');
	const logger = createLogger();
	middlewares.push(logger);
}

let store = createStore(reducers, applyMiddleware(...middlewares));

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('app'));
