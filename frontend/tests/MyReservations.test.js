import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import MyReservationsPage from "../src/pages/MyReservationsPage";
import React from "react";

// Mock rezervacijų duomenys
const mockReservations = [
  {
    _id: "1",
    car: { _id: "101", brand: "Toyota", model: "Corolla", price: 50, passengers: 5, doors: 4, gears: "Automatinė", capacity: 3, image: "/images/car1.jpg" },
    startDate: "2025-02-10T00:00:00.000Z",
    endDate: "2025-02-15T00:00:00.000Z",
    status: "waiting"
  }
];

// Mok fetch funkcija, kad grąžintų duomenis
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockReservations),
  })
);

describe("MyReservationsPage Component", () => {
  test("neatvaizduoja rezervacijų jei vartotojas neprisijungęs", () => {
    render(<MyReservationsPage user={null} />);
    expect(screen.queryByText("Mano rezervacijos")).not.toBeInTheDocument();
  });

  test("parodo kraunamos būseną ir įkelia rezervacijas", async () => {
    render(<MyReservationsPage user={{ id: "123" }} />);

    // Patikriname, ar rodomas kraunamos būsenos tekstas
    expect(screen.getByText("Kraunama...")).toBeInTheDocument();
    
    // Simuliuojame, kad duomenys yra užkrauti ir tikriname, ar rodomos rezervacijos
    await waitFor(() => expect(screen.getByText("Mano rezervacijos")).toBeInTheDocument());
    expect(screen.getByText("Toyota Corolla")).toBeInTheDocument();
  });

  test("parodo rezervacijos statusą", async () => {
    render(<MyReservationsPage user={{ id: "123" }} />);

    // Patikriname, ar rodoma statuso reikšmė
    await waitFor(() => expect(screen.getByText("Mano rezervacijos")).toBeInTheDocument());
    expect(screen.getByText("Laukiama")).toBeInTheDocument();
  });

});
