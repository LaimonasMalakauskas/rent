import React from 'react';
import { render, screen } from '@testing-library/react';
import CarForm from '../src/components/CarForm';
import { BrowserRouter as Router } from 'react-router-dom';

// Testas, kuris tikrina, ar AdminPage ir CarForm yra užkraunami teisingai
describe("AdminPage Component", () => {
  test("should render AdminPage and display CarForm", () => {
    render(
      <Router>
          <CarForm />
        </Router>
    );
    // Patikrina, ar CarForm komponentas užkraunamas
    expect(screen.getByText(/Pridėti automobilį/i)).toBeInTheDocument();
  });
});
