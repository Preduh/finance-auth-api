const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.json')
const User = require('../models/user')

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization

    if (!authHeader) {
        return res.send({ Error: 'No token provided' })
    }

    if (!authHeader.split(' ').length === 2) {
        return res.send({ Error: 'Invalid token formated' })
    }

    const [scheme, token] = authHeader.split(' ')

    if (scheme !== 'Bearer') {
        return res.send({ Error: 'Invalid scheme' })
    }

    jwt.verify(token, authConfig.secret, async (err, decoded) => {
        if (err) {
            res.send({ Error: 'Invalid token' })
        } else {
            const user = await User.findById(decoded.user)

            if (!user) {
                return res.status(401).send({ Error: 'User not found' })
            }

            req.auth = user

            return next()
        }
    })
}