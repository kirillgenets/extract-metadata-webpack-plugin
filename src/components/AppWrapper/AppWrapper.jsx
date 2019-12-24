import React from 'react';
import PropTypes from 'prop-types';

const AppWrapper = (props) => (
    <div>
      Hello Worldddubgvfcdsxad!
    </div>
);

AppWrapper.propTypes = {
  y: PropTypes.object,
  c: PropTypes.bool,
  z: PropTypes.string.isRequired,
};

export default AppWrapper;
