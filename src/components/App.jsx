import React from 'react';
import PropTypes from 'prop-types';

const App = (props) => (
    <div>
      Hello World!
    </div>
);

App.propTypes = {
  m: PropTypes.string.isRequired,
  k: PropTypes.object,
  a: PropTypes.string.isRequired,
  b: PropTypes.number,
  c: PropTypes.bool,
};

export default App;
