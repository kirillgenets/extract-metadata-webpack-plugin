import React from 'react';
import PropTypes from 'prop-types';

const App = (props) => (
    <div>
      Hello World!
    </div>
);

App.propTypes = {
  a: PropTypes.string.isRequired,
  id: PropTypes.string,
};

export default App;
