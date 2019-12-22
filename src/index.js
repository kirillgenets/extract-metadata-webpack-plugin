import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

ReactDOM.render(
  <App
    a="1"
    b={2}
    c={true}
  />,
  document.querySelector('#root')
);
