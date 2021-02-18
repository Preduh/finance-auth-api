const express = require('express')
const router = express.Router()
const Transaction = require('../models/transaction')

/*
[x] Listar transações do usuário
[] Exibir as transações baseado no id do usuário após logado
[] Criar local para registro de novas transações, e as transações devem ser acrescentadas em tempo real
[] Criar botão para a exclusão da transação selecionada
*/

router.post('/create', async (req, res) => {
    try {
        const now = new Date
        let day = 0
        let month = 0

        now.getUTCDate() < 10 ? day = '0' + now.getUTCDate() : day = now.getUTCDate()
        now.getUTCMonth() < 10 ? month = '0' + (now.getUTCMonth() + 1) : month = now.getUTCMonth()

        const date = `${day}/${month}/${now.getUTCFullYear()}`

        const { userId } = {
            userId: req.body.userId,
            transaction: [{
                title: req.body.transaction[0].title,
                price: req.body.transaction[0].price,
                date: date
            }]
        }
        if (await Transaction.findOne({ userId })) {
            const transaction = await Transaction.findOne({ userId })
            transaction.transaction.push({
                title: req.body.transaction[0].title,
                price: req.body.transaction[0].price,
                date: date
            })
            await Transaction.findOneAndUpdate({ userId }, {
                transaction: transaction.transaction
            }
            )

            res.send(transaction)
        } else {
            const transaction = await Transaction.create({
                userId: req.body.userId,
                transaction: [{
                    title: req.body.transaction[0].title,
                    price: req.body.transaction[0].price,
                    date: date
                }]
            })

            return res.send(transaction)
        }
    } catch (err) {
        return res.send(err)
    }
})

router.post('/list', async (req, res) => {
    try {
        const { userId } = req.body

        const transaction = await Transaction.findOne({ userId })

        return res.send(transaction.transaction)
    } catch (err) {
        return res.send({Error: 'Invalid userId'})
    }
})

module.exports = app => app.use('/transaction', router)