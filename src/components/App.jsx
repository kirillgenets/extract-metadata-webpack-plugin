import React from 'react';
import PropTypes from 'prop-types';
import DataTable from '../../DataTable';

const App = (props) => (
    <div>
      Hello World!
    </div>
);

App.propTypes = {
  ...DataTable.propTypes,
  b: PropTypes.number,
  c: PropTypes.bool,
};

export default App;
