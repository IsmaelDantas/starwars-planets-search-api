import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import StarWarsPlanetsContext from './StarWarsPlanetsContext';

const StarWarsPlanetsProvider = ({ children }) => {
  const [state, setState] = useState('idle');
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [backupData, setBackupData] = useState([]);
  const [filtersInfos, setFiltersInfos] = useState({
    filterByName: {
      name: '',
    },
    filterByNumericValues: [],
  });
  const [sortState, setSort] = useState({
    order: {
      column: '',
      sort: '',
    },
  });

  const byName = useMemo(
    () => filtersInfos.filterByName,
    [filtersInfos.filterByName],
  );
  const byNumericValues = useMemo(
    () => filtersInfos.filterByNumericValues,
    [filtersInfos.filterByNumericValues],
  );
  const sortTable = useMemo(
    () => sortState.order,
    [sortState.order],
  );

  const planetsData = useRef();
  const planetsDataByName = useRef();
  const sortData = useRef();

  const sortTableBy = useCallback(({ column, typeOfSort }, table) => {
    let dataSorted = [];

    if (typeOfSort === 'ASC') {
      dataSorted = [...table].sort(({ [column]: valueA }, { [column]: valueB }) => {
        if (valueA === 'unknown') return 1;
        if (valueB === 'unknown') return 0 - 1;

        return valueA - valueB;
      });
    } else if (typeOfSort === 'DESC') {
      dataSorted = [...table].sort(({ [column]: valueA }, { [column]: valueB }) => {
        if (valueA === 'unknown') return 1;
        if (valueB === 'unknown') return 0 - 1;

        return valueB - valueA;
      });
    }

    return dataSorted;
  }, []);

  const getPlanets = useCallback(async () => {
    setState('loading');

    try {
      const urlAPI = 'https://swapi-trybe.herokuapp.com/api/planets/';
      const response = await fetch(urlAPI);
      const { results } = await response.json();
      const dataSorted = results
        .sort(({ name: nameA }, { name: nameB }) => nameA.localeCompare(nameB));

      setState('succeeded');
      setData([...dataSorted]);
      setBackupData([...dataSorted]);

      planetsData.current = [...dataSorted];
    } catch (e) {
      setState('failed');
      setError(e);
    }
  }, []);

  const eraseFilter = useCallback((columnToBeDeleted) => {
    const filtersWithoutErased = byNumericValues
      .filter(({ column }) => column !== columnToBeDeleted);

    setFiltersInfos((prevState) => ({
      ...prevState,
      filterByNumericValues: [
        ...filtersWithoutErased,
      ],
    }));
  }, [byNumericValues]);

  const eraseAllFilters = useCallback(() => {
    setFiltersInfos((prevState) => ({
      ...prevState,
      filterByNumericValues: [],
    }));
  }, []);

  useEffect(() => {
    getPlanets();
  }, [getPlanets]);

  useEffect(() => {
    planetsData.current = [...backupData];
    planetsDataByName.current = [...planetsData.current];
    sortData.current = [...planetsDataByName.current];
  }, [eraseFilter, eraseAllFilters, backupData]);

  useEffect(() => {
    const { name } = byName;

    if (name.length !== 0) {
      const filtered = planetsDataByName.current
        ?.filter(({ name: text }) => text.toLowerCase().includes(name.toLowerCase()));

      setData([...filtered]);
    } else {
      const oldValuesFiltered = planetsData.current ? planetsData.current : [];

      setData([...oldValuesFiltered]);
    }

    const valueFilteredByNumFilters = planetsData.current ? [...planetsData.current] : [];
    planetsDataByName.current = [...valueFilteredByNumFilters];
    sortData.current = [...planetsDataByName.current];
  }, [byName, backupData]);

  useEffect(() => {
    byNumericValues.forEach(({ column, comparison, value }) => {
      if (byNumericValues.length !== 0) {
        const filtered = planetsData.current?.filter(({ [column]: tableValue }) => {
          let compared;
          const valueToBeCompared = Number(tableValue);
          const inputValue = Number(value);

          switch (true) {
          case comparison === 'maior que':
            compared = valueToBeCompared > inputValue;
            break;
          case comparison === 'menor que':
            compared = valueToBeCompared < inputValue;
            break;

          default:
            compared = valueToBeCompared === inputValue;
            break;
          }

          return compared;
        });

        setData([...filtered]);
        planetsData.current = [...filtered];
        planetsDataByName.current = [...planetsData.current];
        sortData.current = [...planetsDataByName.current];
      }
    });

    if (byNumericValues.length === 0) {
      setData([...backupData]);
      planetsData.current = [...backupData];
      planetsDataByName.current = [...planetsData.current];
      sortData.current = [...planetsDataByName.current];
    }
  }, [byNumericValues, backupData]);

  useEffect(() => {
    const { column, sort } = sortTable;
    if (column !== '' || sort !== '') {
      const dataSorted = sortTableBy({ column, typeOfSort: sort }, sortData.current);

      setData([...dataSorted]);
    }
  }, [sortTableBy, sortTable]);

  const filterBy = (filtersValue) => {
    const key = Object.keys(filtersValue)[0];
    const value = Object.values(filtersValue)[0];
    const hasToFilterByName = Object.prototype
      .hasOwnProperty.call(filtersInfos.filterByName, `${key}`);

    if (hasToFilterByName) {
      setFiltersInfos((prevState) => ({
        ...prevState,
        filterByName: {
          ...prevState.filterByName,
          [key]: value,
        },
      }));
    } else {
      setFiltersInfos((prevState) => ({
        ...prevState,
        filterByNumericValues: [
          ...prevState.filterByNumericValues,
          { ...filtersValue },
        ],
      }));
    }
  };

  const sortBy = ({ column, sort }) => {
    setSort({
      order: {
        column,
        sort,
      },
    });
  };

  const contextType = {
    state,
    error,
    data,
    byNumericValues,
    getPlanets,
    filterBy,
    eraseFilter,
    eraseAllFilters,
    sortBy,
  };

  return (
    <StarWarsPlanetsContext.Provider value={ contextType }>
      {children}
    </StarWarsPlanetsContext.Provider>
  );
};

StarWarsPlanetsProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StarWarsPlanetsProvider;
