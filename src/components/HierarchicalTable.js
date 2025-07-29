import React, { useReducer } from 'react';
import TableRow from './TableRow';
import './styles.css';

const calculateParentValue = (children) => {
  return children.reduce((sum, child) => sum + child.value, 0);
};

const initialState = (data) => {
  const clone = JSON.parse(JSON.stringify(data));
  return clone.map((row) => {
    if (row.children) {
      row.value = calculateParentValue(row.children);
      row.children = row.children.map((c) => ({ ...c, variance: 0 }));
    }
    return { ...row, variance: 0 };
  });
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'ALLOCATE_PERCENT': {
      const { id, percent } = action.payload;
      return state.map((row) => updateRow(row, id, 'percent', percent));
    }
    case 'ALLOCATE_VALUE': {
      const { id, value } = action.payload;
      return state.map((row) => updateRow(row, id, 'value', value));
    }
    default:
      return state;
  }
};

const updateRow = (row, id, type, input) => {
  if (row.id === id) {
    const oldVal = row.value;
    const newVal =
      type === 'percent' ? oldVal + (oldVal * input) / 100 : input;
    const variance = ((newVal - oldVal) / oldVal) * 100;
    return { ...row, value: newVal, variance: variance.toFixed(2) };
  } else if (row.children) {
    const newChildren = row.children.map((c) =>
      updateRow(c, id, type, input)
    );
    const newVal = calculateParentValue(newChildren);
    const variance = ((newVal - row.value) / row.value) * 100;
    return { ...row, children: newChildren, value: newVal, variance: variance.toFixed(2) };
  }
  return row;
};

const HierarchicalTable = ({ data }) => {
  const [rows, dispatch] = useReducer(reducer, data, initialState);

  const handleAllocatePercent = (id, input) => {
    dispatch({ type: 'ALLOCATE_PERCENT', payload: { id, percent: input } });
  };

  const handleAllocateValue = (id, input) => {
    dispatch({ type: 'ALLOCATE_VALUE', payload: { id, value: input } });
  };

  const total = rows.reduce((acc, row) => acc + row.value, 0);

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Label</th>
          <th>Value</th>
          <th>Input</th>
          <th>Allocation %</th>
          <th>Allocation Val</th>
          <th>Variance %</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <React.Fragment key={row.id}>
            <TableRow
              row={row}
              level={0}
              onPercent={handleAllocatePercent}
              onValue={handleAllocateValue}
            />
          </React.Fragment>
        ))}
        <tr className="total-row">
          <td>Grand Total</td>
          <td>{total.toFixed(2)}</td>
          <td colSpan={4}></td>
        </tr>
      </tbody>
    </table>
  );
};

export default HierarchicalTable;