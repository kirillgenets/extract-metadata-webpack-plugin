import React from 'react';
import PropTypes from 'prop-types';

const App = (props) => {
  render (
    <div>
      Hello World!
    </div>
  )
}

App.propTypes = {
  a: PropTypes.string.isRequired,
  b: PropTypes.number,
  c: PropTypes.bool
}

export default App;
