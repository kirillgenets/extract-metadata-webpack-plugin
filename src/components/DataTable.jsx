/* eslint-disable react/require-default-props,react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';

const DataTable = (props) => (
  <div>Hello world!!!</div>
);

DataTable.propTypes = {
  id: PropTypes.string.isRequired,
  aggregationMode: PropTypes.string,
  data: PropTypes.arrayOf(PropTypes.shape({})),
  pinnedTopRowData: PropTypes.arrayOf(PropTypes.shape({})),
  pinnedBottomRowData: PropTypes.arrayOf(PropTypes.shape({})),
  columnDefs: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string,
      pinned: PropTypes.oneOf(['left', 'right']),
      headerName: PropTypes.string,
      decimalPlaces: PropTypes.number,
      measurePrefix: PropTypes.string,
      measurePostfix: PropTypes.string,
    }),
  ),
  enableColResize: PropTypes.bool,
  enableColAutoSizeToContent: PropTypes.bool,
  rowDragManaged: PropTypes.bool,
  treeData: PropTypes.bool,
  autoGroupColumnHeaderName: PropTypes.string,
  thousandSeparator: PropTypes.string,
  decimalSeparator: PropTypes.string,
  enableSelection: PropTypes.bool,
  selectedCells: PropTypes.arrayOf(
    PropTypes.shape({
      field: PropTypes.string,
      rowData: PropTypes.shape({}),
    }),
  ),
  selectedRows: PropTypes.arrayOf(PropTypes.object),
  columnStates: PropTypes.shape({}),
  maxDefaultColWidth: PropTypes.number,
  enableSorting: PropTypes.bool,
  enableFilter: PropTypes.bool,
  headerHeight: PropTypes.number,
  themeName: PropTypes.string,
  heatmapConfig: PropTypes.shape({
    color: PropTypes.string,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
  }),
  onSortChanged: PropTypes.func,
  formattingOrder: PropTypes.arrayOf(PropTypes.string),
  sortingState: PropTypes.object,
  setProps: PropTypes.func,
  freezeRowsOrder: PropTypes.bool,
  groupDefaultExpanded: PropTypes.number,
  groupPinned: PropTypes.string,
  groupHideOpenParents: PropTypes.bool,
  groupKeepOpenState: PropTypes.bool,
};

export default DataTable;
