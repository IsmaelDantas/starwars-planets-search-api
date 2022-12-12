import React from 'react';
import './App.css';
import MainContent from './components/MainContent';
import StarWarsPlanetsProvider from './context/StarWarsPlanetsProvider';

function App() {
  return (
    <StarWarsPlanetsProvider>
      <MainContent />
    </StarWarsPlanetsProvider>
  );
}

export default App;
