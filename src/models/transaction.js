const mongoose = require('../database/index')

const transactionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    transaction: [{
        title: {
            type: String
        },
        price: {
            type: Number
        },
        date: {
            type: String
        }
    }]
})

const Transaction = mongoose.model('transactions', transactionSchema)

module.exports = Transaction