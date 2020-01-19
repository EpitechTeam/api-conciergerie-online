const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
let User = require('./../../models/User')

let publicKey = (req, res) => {
    res.send({publicKey: process.env.STRIPE_PUBLISHABLE_KEY});
};

const calculateOrderAmount = items => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the server to prevent
    // people from directly manipulating the amount on the client
    return 1999;
};

let paymentIntents = async (req, res) => {
    let {currency, items} = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateOrderAmount(items),
            currency
        });
        return res.status(200).json(paymentIntent);
    } catch (err) {
        return res.status(500).json({error: err.message});
    }
};

// A webhook to receive events sent from Stripe
// You can listen for specific events
// This webhook endpoint is listening for a payment_intent.succeeded event
let webHook = async (req, res) => {
    // Check if webhook signing is configured.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event;
        let signature = req.headers["stripe-signature"];
        try {
            event = stripe.webhooks.constructEvent(
                req.rawBody,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`);
            return res.sendStatus(400);
        }
        data = event.data;
        eventType = event.type;
    } else {
        // Webhook signing is recommended, but if the secret is not configured in `config.js`,
        // we can retrieve the event data directly from the request body.
        data = req.body.data;
        eventType = req.body.type;
    }

    if (eventType === "payment_intent.succeeded") {
        console.log("💰Your user provided payment details!");
        // Fulfill any orders or e-mail receipts
        res.sendStatus(200);
    }
};
let payed = async (req, res) => {
    let obj = Object.create(req.body);
    console.log(req.user._id, obj)
    delete obj._id;
    try {
        const modified = await User.findOneAndUpdate({_id: req.user._id}, {$set: obj});
        res.status(200).send(modified)
    } catch (error) {
        console.log(error)
        res.status(403).send({'error': 'Unprocessable entity', error})
    }
}

module.exports = {
    payed,
    publicKey,
    paymentIntents,
    webHook
};