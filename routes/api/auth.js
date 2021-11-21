const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator')

const User = require('../../models/User');

// @route     GET api/auth
// @desc      Test route
// @access    Public

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch(err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route     POST api/user/signin
// @desc      Authenticate user & get token
// @access    Public

router.post(
  '/signin', 
  [
    check('email', 'Please include a valid email')
      .isEmail(),
    check(
      'password', 
      'Password is required.'
    ).exists()
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body; 

    try {
      // See if user exists
      let user = await User.findOne({ email });
      
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{msg: 'Invalid Credentials'}] });
      }
      
      // Check the password
      const isMatch = await bcrypt.compare(password, user.password);
      
      if(!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials'}]});
      }

      // Give the token
      const payload = {
        user: {
          id: user.id // with mongoose, you can use '.id' instead of '._id'
        }
      }
      jwt.sign(
        payload, 
        config.get('jwtSecret'), // 'jwtSecret' in config/default 
        { expiresIn: 86400 },
        (err, token) => {
          if(err) throw err;
          res.json({ token });
        }
      );

    } catch(err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);


module.exports = router;