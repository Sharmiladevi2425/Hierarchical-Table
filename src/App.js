import React from 'react';
import HierarchicalTable from './components/HierarchicalTable';
import { data } from './data/data';

const App = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Hierarchical Table</h2>
      <HierarchicalTable data={data} />
    </div>
  );
};

export default App;