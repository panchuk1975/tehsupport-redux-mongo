const { Router } = require("express"); // connect router from express
const {check, validationResult} = require('express-validator')
const config = require('config')
const jwt = require('jsonwebtoken')
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const router = Router(); // create router

// - /api/auth....+register (fetch request)
router.post('/register',
[
    check('email', 'Email is wrong!').isEmail(),
    check('password','Min password is 6 symbols!' ).isLength({min: 6})
],
async (req,res) => {
  try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
          return res.status(400).json({
              errors:errors.array(),
              message: 'Regisstration data is wrong!'
          })
      }
    //-------Get emai and password from frontend req.body--------//
  
    const {
      email,
      password,
      firstName,
      secondName,
      mobilePhon,
      address,
      company
    } = req.body;
    //------------------Check if user exist---------------------//
    const candidate = await User.findOne({ email: email });
    if (candidate) {
      return res.status(400).json({ message: "Such user is exist yet!" });
    }
    //------------------Register a New User---------------------//
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({
      email,
      password: hashedPassword,
      firstName,
      secondName,
      mobilePhon,
      address,
      company
    })
    await user.save()
    res.status(201).json({message:'User was created!'})
  } catch (e) {
    res.status(500).json({ message: "Mistake authRout/register:" + e.message })
  }
});

// - /api/auth....+login (fetch request)------------------------------------------//
router.post("/login", 
[
    check('email', 'Email is wrong!').normalizeEmail().isEmail(),
    check('password','Enter password!' ).exists() 
],
async (req,res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors:errors.array(),
            message: 'Regisstration data is wrong!'
        })
    }
  //-------Get emai and password from frontend req.body--------//
  const {
    email,
    password
  } = req.body;
  //------------------Check if user exist---------------------//
  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(400).json({ messsage: "User is not exist!" });
  }
  //---------------------Check passwordss---------------------//
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
      return res.status(400).json({ message: "Enter data is wrong!"})
  }
  const token = jwt.sign( // - create token
      {userId: user.id},
      config.get('jwtSecret'),
      {expiresIn: '12h'}
  ) // responsse to user 
 res.json({token, userId: user.id}) 
  } catch (e) {
    res.status(500).json({ message: "Mistake authRout/login:" + e.message })
  }
})

//----Export object router from module---//
module.exports = router;
