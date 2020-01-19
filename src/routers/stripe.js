const express = require('express')
const router = express.Router()
const stripeService = require('../services/stripe/stripe')
const auth = require('../middleware/auth');

router.post('/public-key', stripeService.publicKey)

router.post('/payment-intents', stripeService.paymentIntents)

router.post('/webhook', stripeService.webHook)

router.post('/payed', auth, stripeService.payed)

module.exports = router