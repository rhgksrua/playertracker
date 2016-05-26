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

const loggerMiddleware = createLogger();

let store = createStore(reducers, applyMiddleware(thunkMiddleware, loggerMiddleware));

ReactDOM.render((
    <Provider store={store}>
        <App />
    </Provider>
), document.getElementById('app'));
