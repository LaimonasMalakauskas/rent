import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Register from '../src/pages/Signup.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';


fetchMock.enableMocks();

describe('Register component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should render form components correctly', () => {
    render(
      <Router>
        <Register setUser={() => {}} />
      </Router>
    );

    // Tikriname, ar formos elementai užkrauti
    expect(screen.getByLabelText('El. paštas')).toBeInTheDocument();
    expect(screen.getByLabelText('Slaptažodis')).toBeInTheDocument();
    expect(screen.getByText('Registruotis')).toBeInTheDocument();
  });

  it('should show an alert with error message if server returns an error', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: 'El. paštas jau užregistruotas' }),
      { status: 400 }
    );

    render(
      <Router>
        <Register setUser={() => {}} />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('El. paštas'), {
      target: { value: 'existing@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Slaptažodis'), {
      target: { value: 'Password123!@#' },
    });

    fireEvent.click(screen.getByText('Registruotis'));

    // Tikriname, kad serverio klaidos pranešimas yra rodomas
    const errorMessage = await screen.findByText('El. paštas jau užregistruotas');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should show an alert with network error message if there is a network error', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));

    render(
      <Router>
        <Register setUser={() => {}} />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('El. paštas'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Slaptažodis'), {
      target: { value: 'Password123!@#' },
    });

    fireEvent.click(screen.getByText('Registruotis'));

    // Tikriname, kad buvo iškviesta klaidos pranešimas apie tinklo klaidą
    const networkErrorMessage = await screen.findByText('Tinklo klaida');
    expect(networkErrorMessage).toBeInTheDocument();
  });
});










