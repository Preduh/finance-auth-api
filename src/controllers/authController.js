const express = require('express')
const router = express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const authMiddleware = require('../middlewares/auth')

const secret = process.env.SECRET

router.post('/register', async (req, res) => {
    try {
        const { email } = req.body
        if (await User.findOne({ email })) {
            res.send({ Error: 'User already exists' })
        } else {
            const user = await User.create(req.body)
            user.password = undefined

            const token = jwt.sign({ user: user.id }, secret, { expiresIn: 86400 })

            return res.send({ user, token })
        }
    } catch (err) {
        return res.send({ Error: 'User create failed' })
    }
})

router.get('/login', async (req, res) => {
    try {
        const [ hashType, hash ] = await req.headers.authorization.split(' ')
        const [ email, password ] = await Buffer.from(hash, 'base64').toString().split(':')

        const user = await User.findOne({ email }).select('+password')

        if (hashType !== 'Basic') {
            return res.send({ Error: 'Hash type invalid' })
        }

        if (!user) {
            return res.send({ Error: 'User not found' })
        }

        if (!await bcrypt.compare(password, user.password)) {
            return res.send({ Error: 'Invalid password' })
        }

        const token = jwt.sign({ user: user.id }, secret, { expiresIn: 86400 })

        user.password = undefined

        return res.send({ user, token })
    } catch (err) {
        return res.send({ Error: 'Login failed' })
    }
})

router.get('/me', authMiddleware, async (req, res) => {
    res.send(req.auth)
})

module.exports = app => app.use(router)