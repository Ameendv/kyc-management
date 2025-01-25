const express = require('express')
const router = express()
const jwt = require('jsonwebtoken')
const { generateRefreshToken } = require('../utils/generateRefreshToken');



router.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken; 
  
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async(err, user) => {
      if (err) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }
  
      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      const newRefreshToken = await generateRefreshToken(user.id);
  
      res.json({ accessToken, refreshToken: newRefreshToken }); 
    });
  });

  module.exports = router