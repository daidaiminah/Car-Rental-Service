import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"], // you can add mobile money later
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Car Rental Booking", // or car model name
            },
            unit_amount: 5000, // $50 (amount in cents)
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:5000/success", // your frontend success page
      cancel_url: "http://localhost:5000/cancel",   // your frontend cancel page
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("❌ Stripe error:", error.message);
    res.status(500).json({ error: error.message });
  }
};
