import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

import App from './App';
import Grid from './Grid';
import * as serviceWorker from './serviceWorker';

//import './App.css';
import './assets/scss/style.scss';

const history = createBrowserHistory();

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById('root')
);

// wrap App in Router

// idk who made this, but createRoot doesn't seem to be a function that's been imported anywhere and it causes errors - sam

// const rootElement = document.getElementById('root');
// const root = ReactDOM.createRoot(rootElement);
// root.render(
//   <Router>
//     <App />
//   </Router>
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
