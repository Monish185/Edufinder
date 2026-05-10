const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const User = require("../models/user");

const activatePlan = async (req, res) => {
  try {
    const { sessionId  } = req.body;


    if(!sessionId){
        return res.status(500).json({success: false, messgae: "payment session id missing"})
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    const userId = session.metadata.userId;
    const plan = session.metadata.plan;

    await User.findByIdAndUpdate(userId, {
      subscriptionPlan: plan,
      subscriptionStatus: "active",
    });

    return res.status(200).json({
      success: true,
      message: "Plan activated",
      plan: plan
    });
  } catch (err) {
    console.log(err)
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const createCheckoutSession = async (req, res) => {
  try {
    const { plan, userId } = req.body;

    let amount = 0;

    if (plan === "basic") {
      amount = 299;
    } else if (plan === "premium") {
      amount = 699;
    } else if (plan === "ultra") {
      amount = 1499;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],

      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "inr",

            product_data: {
              name: `${plan.toUpperCase()} Counseling Plan`,
            },

            unit_amount: amount * 100,
          },

          quantity: 1,
        },
      ],

      metadata: {
        userId,
        plan,
      },

      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    return res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { createCheckoutSession, activatePlan };
