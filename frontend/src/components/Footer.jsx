import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>Apie mus</h5>
            <p>
              Mes teikiame aukštos kokybės paslaugas, siekiame nuolat tobulėti ir užtikrinti geriausią vartotojo patirtį.
            </p>
          </div>
          <div className="col-md-4">
            <h5>Naudingos nuorodos</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/about" className="text-white text-decoration-none">Apie mus</a>
              </li>
              <li>
                <a href="/services" className="text-white text-decoration-none">Paslaugos</a>
              </li>
              <li>
                <a href="/contact" className="text-white text-decoration-none">Kontaktai</a>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Kontaktai</h5>
            <p><i className="bi bi-geo-alt-fill me-2"></i>Vilnius, Lietuva</p>
            <p><i className="bi bi-telephone-fill me-2"></i>+370 600 12345</p>
            <p><i className="bi bi-envelope-fill me-2"></i>info@info.com</p>
          </div>
        </div>
        <hr className="my-4 border-light" />
        <div className="text-center">
          <p className="mb-0">&copy; 2025 Mano Kompanija. Visos teisės saugomos.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
