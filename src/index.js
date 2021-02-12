const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

// Configs
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Routes
require('./controllers/authController')(app)
require('./controllers/transactionController')(app)

app.listen(process.env.PORT || 8081, () => {
    console.log('Server is online')
})