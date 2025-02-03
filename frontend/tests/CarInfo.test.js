import React from 'react';
import { render, screen } from '@testing-library/react';
import CarInfo from '../src/components/CarInfo';

describe("CarInfo Component", () => {
  const mockCar = {
    model: "Audi A4",
    price: 50,
    passengers: 5,
    doors: 4,
    gears: "Automatic",
    capacity: 3,
    available: true,
    image: "/car-image.jpg"
  };

  const mockUser = { role: "admin" };

  test("should render CarInfo with all car details", () => {
    render(<CarInfo car={mockCar} user={mockUser} />);

    // Patikrina, ar automobilio modelis rodomas
    expect(screen.getByText(/Audi A4/i)).toBeInTheDocument();

    // Patikrina, ar kaina rodomas
    expect(screen.getByText(/€50.00\/diena/i)).toBeInTheDocument();

    // Patikrina, ar keleivių skaičius rodomas
    expect(screen.getByText(/Keleivių skaičius:/i)).toBeInTheDocument();

    // Patikrina, ar durelių skaičius rodomas
    expect(screen.getByText(/Durelių skaičius:/i)).toBeInTheDocument();

    // Patikrina, ar pavarų tipas rodomas
    expect(screen.getByText(/Pavarų tipas:/i)).toBeInTheDocument();

    // Patikrina, ar bagažo talpa rodomas
    expect(screen.getByText(/Bagažo talpa:/i)).toBeInTheDocument();

    // Patikrina, ar automobilio statusas rodomas (adminui)
    expect(screen.getByText(/Pasiekiamas/i)).toBeInTheDocument();

    // Patikrina, ar rodomas automobilio vaizdas
    expect(screen.getByAltText(/Audi A4/i)).toBeInTheDocument();

    // Patikrina, ar rodomi ikonėlės
    expect(screen.getByTestId("fa-car")).toBeInTheDocument();
    expect(screen.getByTestId("fa-users")).toBeInTheDocument();
    expect(screen.getByTestId("fa-luggage-cart")).toBeInTheDocument();
    expect(screen.getByTestId("fa-cogs")).toBeInTheDocument();
    expect(screen.getByTestId("fa-euro-sign")).toBeInTheDocument();
    expect(screen.getByTestId("fa-check-circle")).toBeInTheDocument();
  });

  test("should render unavailable status if car is not available", () => {
    const unavailableCar = { ...mockCar, available: false };

    render(<CarInfo car={unavailableCar} user={mockUser} />);

    // Patikrina, ar rodomas nepasiekiamas statusas
    expect(screen.getByText(/Nepasiekiamas/i)).toBeInTheDocument();
  });
});
