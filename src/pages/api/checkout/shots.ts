import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

const PRICES = {
  100: { price: 400, promptWizardQuantity: 20 },
  200: { price: 700, promptWizardQuantity: 40 },
  300: { price: 900, promptWizardQuantity: 80 },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const quantity = Number(req.query.quantity);
  const ppi = req.query.ppi;

  if (quantity !== 100 && quantity !== 200 && quantity !== 300) {
    return res.status(400).json("invalid_quantity");
  }

  try {
    const session = await stripe.checkout.sessions.create({
      allow_promotion_codes: true,
      metadata: {
        projectId: req.query.ppi as string,
        quantity,
        promptWizardQuantity: PRICES[quantity].promptWizardQuantity,
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: PRICES[quantity].price,
            product_data: {
              name: `⚡️ Refill +${quantity} shots and ${PRICES[quantity].promptWizardQuantity} prompt assists`,
            },
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/studio/${ppi}/?session_id={CHECKOUT_SESSION_ID}&ppi=${ppi}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/studio/${ppi}`,
    });

    return res.redirect(303, session.url!);
  } catch (err: any) {
    return res.status(400).json(err.message);
  }
}
