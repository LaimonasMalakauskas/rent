import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CarList from '../src/components/CarList';
import { BrowserRouter as Router } from 'react-router-dom';

describe('CarList Component', () => {
  test('should render without crashing', () => {
    render(
      <Router>
        <CarList user={{ role: 'admin' }} />
      </Router>
    );

    // Tikrinama, ar komponentas užsikrauna, tikrindami, ar puslapis buvo atvaizduotas
    expect(screen.getByText('Turimi Automobiliai')).toBeInTheDocument();
  });
});
