import App from './app';
import Issue from './issue';
import { Router, Route, browserHistory } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';

const router = (
    <Router history={browserHistory}>
        <Route path="/" component={App}/>
        <Route path="/issue/*" component ={Issue} />
    </Router>

);

ReactDOM.render(
    router,
    document.querySelector('main')
);
