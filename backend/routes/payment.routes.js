const express = require('express')
const router = express.Router()
const {createCheckoutSession,activatePlan} = require('../controllers/payment.controller')
const {StripeWebhooks} = require('../controllers/stripeWebhooks.controller')

router.post('/create-checkout-session',createCheckoutSession)
router.post('/activate-plan',activatePlan)

module.exports = router