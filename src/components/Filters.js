import React, { useContext, useEffect, useState } from 'react';
import StarWarsPlanetsContext from '../context/StarWarsPlanetsContext';

const Filters = () => {
  const {
    filterBy, byNumericValues: numericValues, eraseAllFilters, sortBy,
  } = useContext(StarWarsPlanetsContext);
  const [inputs, setImputs] = useState({
    name: '',
    column: '',
    columnSort: 'population',
    columnOnptions: [],
    sort: '',
    comparison: 'maior que',
    value: 0,
  });

  useEffect(() => {
    setImputs((prevState) => {
      const backupOptions = [
        'population', 'orbital_period', 'diameter', 'rotation_period', 'surface_water',
      ];
      const isEmpty = numericValues.length !== 0;
      const arrayWithoutSelectedOpt = isEmpty
        ? backupOptions
          .filter((option) => !numericValues.some(({ column }) => column === option))
        : backupOptions;

      return {
        ...prevState,
        columnOnptions: [...arrayWithoutSelectedOpt],
        column: arrayWithoutSelectedOpt[0],
      };
    });
  }, [numericValues]);

  const handleOnChange = ({ target: { name: inputName, value: inputValue } }) => {
    setImputs((prevState) => ({
      ...prevState,
      [inputName]: inputValue,
    }));

    if (inputName === 'name') filterBy({ [inputName]: inputValue });
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const { target: { name } } = e;

    if (name === 'filter') {
      const { column, comparison, value } = inputs;

      if (column) {
        filterBy({ column, comparison, value });
      }
    } else if (name === 'sort') {
      const { columnSort, sort } = inputs;

      sortBy({ column: columnSort, sort });
    }
  };

  const handleOnClick = () => {
    eraseAllFilters();
  };

  return (
    <section>
      <input
        data-testid="name-filter"
        type="text"
        name="name"
        value={ inputs.name }
        onChange={ handleOnChange }
      />
      <form
        name="filter"
        onSubmit={ handleOnSubmit }
      >
        <select
          data-testid="column-filter"
          name="column"
          value={ inputs.column }
          onChange={ handleOnChange }
        >
          {inputs.columnOnptions.map((option) => (
            <option
              key={ option }
            >
              { option }
            </option>
          ))}
        </select>
        <select
          data-testid="comparison-filter"
          name="comparison"
          value={ inputs.comparison }
          onChange={ handleOnChange }
        >
          <option>maior que</option>
          <option>menor que</option>
          <option>igual a</option>
        </select>
        <input
          required
          data-testid="value-filter"
          name="value"
          type="number"
          value={ inputs.value }
          onChange={ handleOnChange }
        />
        <button
          data-testid="button-filter"
          type="submit"
        >
          Filtrar
        </button>
      </form>
      <div>
        <button
          data-testid="button-remove-filters"
          type="button"
          onClick={ handleOnClick }
        >
          Remover todos os filtros
        </button>
      </div>
      <form
        name="sort"
        onSubmit={ handleOnSubmit }
      >
        <select
          data-testid="column-sort"
          name="columnSort"
          value={ inputs.columnSort }
          onChange={ handleOnChange }
        >
          <option>population</option>
          <option>orbital_period</option>
          <option>diameter</option>
          <option>rotation_period</option>
          <option>surface_water</option>
        </select>
        <div>
          <label
            htmlFor="ASC"
          >
            <input
              required
              data-testid="column-sort-input-asc"
              type="radio"
              name="sort"
              id="ASC"
              value="ASC"
              checked={ inputs.sort === 'ASC' }
              onChange={ handleOnChange }
            />
            Ascendente
          </label>
          <label
            htmlFor="DESC"
          >
            <input
              required
              data-testid="column-sort-input-desc"
              type="radio"
              name="sort"
              id="DESC"
              value="DESC"
              checked={ inputs.sort === 'DESC' }
              onChange={ handleOnChange }
            />
            Descendente
          </label>
        </div>
        <div>
          <button
            data-testid="column-sort-button"
            type="submit"
          >
            Ordenar
          </button>
        </div>
      </form>
    </section>
  );
};

export default Filters;
