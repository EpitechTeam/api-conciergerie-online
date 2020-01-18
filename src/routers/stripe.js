const express = require('express')

const router = express.Router()
const stripeService = require('../services/stripe/stripe')

router.post('/public-key', stripeService.publicKey)

router.post('/payment-intents', stripeService.paymentIntents)

router.post('/webhook', stripeService.webHook)

module.exports = router