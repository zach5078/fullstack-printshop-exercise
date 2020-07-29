import React from 'react';
import './App.css';

function App(props = {}) {

  return (
    <div className="App">
      {props.products ? props.products.map(item => {
        const { description, username, img, _id } = item || {}
        return (
          <React.Fragment key={_id}>
            <img src={img} alt="product cover" />
            <div>{description}</div>
            <h1>{username}</h1>
          </React.Fragment>
        )
      }) : 'No product found'}
    </div>
  );
}

export default App;
