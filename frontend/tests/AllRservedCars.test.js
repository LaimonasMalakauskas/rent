import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AllReservedCars from "../src/pages/AllReservedCars";
import { BrowserRouter as Router } from 'react-router-dom';

// Mok global fetch, kad grąžintų pavyzdinius duomenis
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            _id: "1",
            car: { model: "Audi" },
            startDate: "2025-01-01T00:00:00Z",
            endDate: "2025-01-02T00:00:00Z",
            status: "waiting",
            user: { email: "user@example.com" },
          },
        ]),
    })
  );
});

describe("AllReservedCars Component", () => {
  test("should load and display reservations correctly", async () => {
    render(
    
      <Router>
          <AllReservedCars />
        </Router>
    );

    // Patikrina, ar puslapis rodo tekstą, kad duomenys kraunami
    expect(screen.getByText(/Kraunama.../i)).toBeInTheDocument();

    // Laukia, kol duomenys užsikraus ir pasirodys pirmas rezervacijos įrašas
    await waitFor(() => screen.getByText(/Audi/));

    // Patikrina, ar automobilio modelis rodomas
    expect(screen.getByText(/Audi/)).toBeInTheDocument();

    // Patikrina, ar rezervacijos statusas rodomas
    expect(screen.getByText(/waiting/)).toBeInTheDocument();
  });

  test("should display error message when fetch fails", async () => {
    // Simuliuoti klaidą fetch užklausoje
    global.fetch.mockImplementationOnce(() => Promise.reject(new Error("Klaida užkraunant duomenis")));

    render(
    
    <Router>
        <AllReservedCars />
      </Router>
  );

    // Laukia klaidos pranešimo
    await waitFor(() => screen.getByText(/Klaida: Klaida užkraunant duomenis/i));

    // Patikrina klaidos žinutę
    expect(screen.getByText(/Klaida: Klaida užkraunant duomenis/i)).toBeInTheDocument();
  });
});
