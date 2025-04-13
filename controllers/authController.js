const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const TokenBlacklist = require('../models/TokenBlacklist');

exports.logout = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (token) {
    await TokenBlacklist.create({ token });

    res.status(200).json({ message: 'Logged out successfully' });
  } else {
    res.status(400).json({ message: 'No token provided' });
  }
};

exports.register = async (req, res) => {
    const { email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await User.create({ email, password: hashedPassword });
  
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      res.status(201).json({ message: 'User registered', token });
    } catch (err) {
      res.status(400).json({ message: 'Error registering user', error: err.message });
    }
  };
  

  exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
      res.status(500).json({ message: 'Login error' });
    }
  };
  