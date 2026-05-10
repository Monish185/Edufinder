// controllers/webhookController.js

const Stripe = require("stripe");
const User = require("../models/User");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const StripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const userId = session.metadata.userId;
        const plan = session.metadata.plan;

        await User.findByIdAndUpdate(userId, {
          subscriptionPlan: plan,
          subscriptionStatus: "active",
        });

        console.log(`Payment successful for ${userId}`);

        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    return res.status(200).json({
      received: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { StripeWebhooks };