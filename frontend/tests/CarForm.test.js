import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import CarForm from '../src/components/CarForm.jsx';

test('užkrauna CarForm komponentą ir rodo formos laukus', () => {
  render(
    <BrowserRouter>
      <CarForm />
    </BrowserRouter>
  ); 

  // Patikriname, ar rodomi formos elementai
  expect(screen.getByLabelText(/Nuotrauka:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Modelis:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Krepšių skaičius:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Keleivių skaičius:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Durelių skaičius:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Pavarų tipas:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Kaina:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Ar pasiekiamas nuomai?/i)).toBeInTheDocument();
  const submitButton = screen.getByRole('button', { name: /Pridėti/i });
  expect(submitButton).toBeInTheDocument();
});

test('parodo klaidos pranešimą, jei formoje trūksta privalomų laukų', async () => {
  render(
    <BrowserRouter>
      <CarForm />
    </BrowserRouter>
  ); 

  // Simuliuojame formos pateikimą be įvesties
  const submitButton = screen.getByRole('button', { name: /Pridėti/i });
  submitButton.click();

});
