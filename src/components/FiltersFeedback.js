import React, { useContext } from 'react';
import StarWarsPlanetsContext from '../context/StarWarsPlanetsContext';

const FiltersFeedback = () => {
  const { byNumericValues, eraseFilter } = useContext(StarWarsPlanetsContext);

  return (
    <section>
      {
        byNumericValues.length !== 0
        && byNumericValues?.map(({ column, comparison, value }) => (
          <span
            data-testid="filter"
            key={ column }
          >
            {column}
            {' | '}
            {comparison}
            {' | '}
            {value}
            <button
              type="button"
              onClick={ () => eraseFilter(column) }
            >
              Apagar
            </button>
          </span>
        ))
      }
    </section>
  );
};

export default FiltersFeedback;
