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
  initialData = {
    products: [{
      "tags": [
      "test",
      "hello"
      ],
      "_id": "ckd76mdgu0001oxcb0ily5mk1",
      "description": "This is test product1",
      "imgThumb": "http://test.cn",
      "img": "https://images.unsplash.com/photo-1595939152815-39e7ff7dbc76?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=164&q=80",
      "link": "http://test.cn",
      "userId": "123",
      "userName": "zac",
      "userLink": "http://test.cn",
      "__v": 0
      }]
  }
}

ReactDOM.hydrate(
  <App {...initialData} />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
