const router = require('express').Router();
const User = require('../model/user');
const jwt = require('jsonwebtoken')
const { loginValidation, registerValidation } = require('../validation')
const bcrypt = require('bcryptjs')

router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) return res.status(400).send('Email already exists');

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    try {
        const savedUser = await user.save();
        res.send({ user: savedUser._id });
    } catch (err) {
        res.status(400).send(err);
    }
})

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    const user = await User.findOne({ email: req.body.email });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
            expiresIn: 300 // expires in 5min
          });
        res.header('auth-token', token).send('Logged in!')
    } else
        return res.status(400).send('Invalid email and/or password')
})

module.exports = router;