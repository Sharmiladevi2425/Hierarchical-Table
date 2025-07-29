import React, { useState } from 'react';

const TableRow = ({ row, level, onPercent, onValue }) => {
  const [input, setInput] = useState('');
  const indent = '-- '.repeat(level);

  return (
    <>
      <tr>
        <td>{indent + row.label}</td>
        <td>{row.value.toFixed(2)}</td>
        <td>
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ width: '60px' }}
          />
        </td>
        <td>
          <button onClick={() => onPercent(row.id, parseFloat(input) || 0)}>
            %
          </button>
        </td>
        <td>
          <button onClick={() => onValue(row.id, parseFloat(input) || 0)}>
            Val
          </button>
        </td>
        <td>{row.variance || '0'}%</td>
      </tr>
      {row.children &&
        row.children.map((child) => (
          <TableRow
            key={child.id}
            row={child}
            level={level + 1}
            onPercent={onPercent}
            onValue={onValue}
          />
        ))}
    </>
  );
};

export default TableRow;