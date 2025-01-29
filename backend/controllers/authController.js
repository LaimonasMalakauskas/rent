const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const validator = require('validator');

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Prašome užpildyti visus laukus' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Prašome įvesti galiojantį el. pašto adresą' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'Slaptažodis turi būti bent 8 simbolių ilgumo' });
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json({ message: 'Slaptažodis turi turėti bent vieną didžiąją raidę' });
  }
  if (!/[a-z]/.test(password)) {
    return res.status(400).json({ message: 'Slaptažodis turi turėti bent vieną mažąją raidę' });
  }
  if (!/[0-9]/.test(password)) {
    return res.status(400).json({ message: 'Slaptažodis turi turėti bent vieną skaičių' });
  }
  if (!/[!@#$%^&*]/.test(password)) {
    return res.status(400).json({ message: 'Slaptažodis turi turėti bent vieną specialų simbolį' });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: 'Šis el. paštas jau naudojamas' });
  }

  const user = new User({
    email,
    password,
  });

  try {
    await user.save();
    res.status(201).json({ message: 'Registracija sėkminga' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Prašome užpildyti visus laukus' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Prašome įvesti galiojantį el. pašto adresą' });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: 'Neteisingas el. paštas arba slaptažodis' });
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ message: 'Neteisingas el. paštas arba slaptažodis' });
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.json({
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
};

module.exports = { registerUser, loginUser };
