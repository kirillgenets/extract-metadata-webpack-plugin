import React from 'react';
import PropTypes from 'prop-types';

const AppContainer = (props) => (
    <div>
      Hello Worldddd!
    </div>
);

AppContainer.propTypes = {
  k: PropTypes.object,
  m: PropTypes.string.isRequired,
  a: PropTypes.string.isRequired,
};

export default AppContainer;
