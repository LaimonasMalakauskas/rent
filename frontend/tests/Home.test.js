import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from '../src/pages/HomePage.jsx'; 
import { BrowserRouter } from 'react-router-dom';

test('užkrauna HomePage', () => {
  const user = { };

  render(
    <BrowserRouter>
      <HomePage user={user} />
    </BrowserRouter>
  );

  // Patikriname, ar puslapis užkrautas, pvz., tikrinant, ar matomas tekstas
  expect(screen.getByText("Turimi Automobiliai")).toBeInTheDocument();
});
