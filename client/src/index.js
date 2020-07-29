import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

let initialData
try {
  initialData = JSON.parse(document.getElementById('initial-data').innerText);
} catch(err) {
  console.log(err)
}

ReactDOM.hydrate(
  <App {...initialData} />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
