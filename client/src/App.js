import React from 'react'
import User from './User'
import Products from './Products'

import './App.css';

function App(props) {

  return (
    <div className="App">
      <User />
      <Products products={props.products || []} />
    </div>
  );
}

export default App;
