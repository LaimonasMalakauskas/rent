import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../src/pages/Login.jsx';
import { BrowserRouter as Router } from 'react-router-dom';

// Mok fetch
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

describe('Login component', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    localStorage.clear();
  });

  it('should render all components correctly', () => {
    render(
      <Router>
        <Login setUser={() => {}} />
      </Router>
    );
  
    // Tikriname, ar yra antraštė (h2)
    expect(screen.getByRole('heading', { level: 2, name: 'Prisijungti' })).toBeInTheDocument();
    
    // Tikriname, ar yra el. pašto ir slaptažodžio laukeliai
    expect(screen.getByLabelText('El. paštas:')).toBeInTheDocument();
    expect(screen.getByLabelText('Slaptažodis:')).toBeInTheDocument();
  
    // Tikriname, ar yra prisijungimo mygtukas
    expect(screen.getByRole('button', { name: 'Prisijungti' })).toBeInTheDocument();
  });

  it('should show an error if server returns an error', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ message: 'Neteisingas el. paštas arba slaptažodis' }),
      { status: 401 }
    );

    render(
      <Router>
        <Login setUser={() => {}} />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('El. paštas:'), {
      target: { value: 'wrong@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Slaptažodis:'), {
      target: { value: 'wrongpassword' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Prisijungti' }));

    const errorMessage = await screen.findByText('Neteisingas el. paštas arba slaptažodis');
    expect(errorMessage).toBeInTheDocument();
  });

  it('should show an error if there is a network issue', async () => {
    fetchMock.mockRejectOnce(new Error('Network error'));

    render(
      <Router>
        <Login setUser={() => {}} />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('El. paštas:'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Slaptažodis:'), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Prisijungti' }));

    const networkErrorMessage = await screen.findByText('Įvyko klaida, bandykite vėliau');
    expect(networkErrorMessage).toBeInTheDocument();
  });

  it('should store user in localStorage and call setUser on successful login', async () => {
    const mockUser = { email: 'user@example.com' };
    const setUserMock = jest.fn();

    fetchMock.mockResponseOnce(JSON.stringify({ user: mockUser }), { status: 200 });

    render(
      <Router>
        <Login setUser={setUserMock} />
      </Router>
    );

    fireEvent.change(screen.getByLabelText('El. paštas:'), {
      target: { value: 'user@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Slaptažodis:'), {
      target: { value: 'Password123' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Prisijungti' }));

    await waitFor(() => {
      expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockUser));
      expect(setUserMock).toHaveBeenCalledWith(mockUser);
    });
  });
});
