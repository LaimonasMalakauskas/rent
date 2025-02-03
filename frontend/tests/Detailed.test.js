import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DetailedInfoPage from '../src/pages/DetailedInfoPage.jsx'; 
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

// Fake API atsakas
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ model: 'Audi A4', year: 2021 }),
  })
);

test('užkrauna DetailedInfoPage ir rodo komponentus', async () => {
  const user = { role: 'user' };  // Galima pakeisti pagal vartotojo rolę

  render(
    <MemoryRouter initialEntries={['/cars/1']}>
      <DetailedInfoPage user={user} />
    </MemoryRouter>
  );

  // Patikriname, ar rodomas tekstas "Kraunama...", kai duomenys dar kraunami
  expect(screen.getByText('Kraunama...')).toBeInTheDocument();

  // Laukiame, kol duomenys bus užkrauti
  await waitFor(() => expect(screen.getByText('Audi A4')).toBeInTheDocument());

  // Patikriname, ar rodomas CarInfo komponentas
  expect(screen.getByText('Audi A4')).toBeInTheDocument();  // Galima pakeisti į automobilio pavadinimą

  // Patikriname, ar rodomas ReservationForm komponentas, jei vartotojas turi rolę 'user'
  expect(screen.getByRole('button', { name: /Atlikti rezervaciją/i })).toBeInTheDocument();


  // Patikriname, ar yra mygtukas "Grįžti"
  expect(screen.getByText('Grįžti')).toBeInTheDocument();
});
