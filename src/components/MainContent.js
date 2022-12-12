import React from 'react';
import Filters from './Filters';
import FiltersFeedback from './FiltersFeedback';
import Table from './Table';

const MainContent = () => (
  <main>
    <Filters />
    <FiltersFeedback />
    <Table />
  </main>
);

export default MainContent;
